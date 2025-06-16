import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Type definitions
type APIProvider = "local" | "huggingface" | "openai" | "anthropic" | "groq";

type APIHandler = (
  message: string,
  selectedLLM: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder
) => Promise<string>;

interface StreamChunk {
  type: "chunk" | "complete" | "error";
  content?: string;
  accumulated?: string;
  message?: string;
  botMessage?: {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
  };
  userMessage?: {
    id: string;
    content: string;
    sender: string;
    timestamp: string;
  };
}

interface OllamaResponse {
  response?: string;
  done?: boolean;
}

interface OpenAIResponse {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
}

interface AnthropicResponse {
  type?: string;
  delta?: {
    text?: string;
  };
}

interface HuggingFaceResponse {
  generated_text?: string;
}

// Enhanced API handler supporting multiple providers
const getAPIHandler = (selectedAPI: string): APIHandler => {
  switch (selectedAPI) {
    case "local":
      return handleOllamaAPI;
    case "huggingface":
      return handleHuggingFaceAPI;
    case "openai":
      return handleOpenAIAPI;
    case "anthropic":
      return handleAnthropicAPI;
    case "groq":
      return handleGroqAPI;
    default:
      return handleOllamaAPI;
  }
};

// Ollama (Local) Handler - Enhanced
const handleOllamaAPI: APIHandler = async (
  message,
  selectedLLM,
  controller,
  encoder
) => {
  let aiResponse = "";

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedLLM || "llama3.2",
      prompt: message,
      stream: true,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 2048,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Ollama API request failed");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.trim());

    for (const line of lines) {
      try {
        const data: OllamaResponse = JSON.parse(line);
        if (data.response) {
          aiResponse += data.response;

          const sseData: StreamChunk = {
            type: "chunk",
            content: data.response,
            accumulated: aiResponse,
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`)
          );
        }

        if (data.done) {
          return aiResponse;
        }
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError, line);
      }
    }
  }

  return aiResponse;
};

// OpenAI Handler
const handleOpenAIAPI: APIHandler = async (
  message,
  selectedLLM,
  controller,
  encoder
) => {
  let aiResponse = "";

  // Validate API key
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: selectedLLM,
      messages: [{ role: "user", content: message }],
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API request failed: ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk
      .split("\n")
      .filter((line) => line.trim().startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "");
      if (data === "[DONE]") return aiResponse;

      try {
        const parsed: OpenAIResponse = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content || "";

        if (content) {
          aiResponse += content;

          const sseData: StreamChunk = {
            type: "chunk",
            content: content,
            accumulated: aiResponse,
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`)
          );
        }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
      }
    }
  }

  return aiResponse;
};

// Anthropic Claude Handler
const handleAnthropicAPI: APIHandler = async (
  message,
  selectedLLM,
  controller,
  encoder
) => {
  let aiResponse = "";

  // Validate API key
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key is not configured");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: selectedLLM,
      max_tokens: 2048,
      messages: [{ role: "user", content: message }],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error("Anthropic API request failed");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk
      .split("\n")
      .filter((line) => line.trim().startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "");
      if (data === "[DONE]") return aiResponse;

      try {
        const parsed: AnthropicResponse = JSON.parse(data);
        if (parsed.type === "content_block_delta") {
          const content = parsed.delta?.text || "";

          if (content) {
            aiResponse += content;

            const sseData: StreamChunk = {
              type: "chunk",
              content: content,
              accumulated: aiResponse,
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`)
            );
          }
        }
      } catch (parseError) {
        console.error("Error parsing Anthropic response:", parseError);
      }
    }
  }

  return aiResponse;
};

// Groq Handler (Very fast inference)
const handleGroqAPI: APIHandler = async (
  message,
  selectedLLM,
  controller,
  encoder
) => {
  let aiResponse = "";

  // Validate API key
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Groq API key is not configured");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedLLM,
        messages: [{ role: "user", content: message }],
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Groq API request failed");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body");
  }

  const decoder = new TextDecoder();
  let buffer = ""; // Buffer to accumulate incomplete chunks

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Add new chunk to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split by lines and process complete lines
      const lines = buffer.split("\n");

      // Keep the last line in buffer (might be incomplete)
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();

        // Skip empty lines and non-data lines
        if (!trimmedLine || !trimmedLine.startsWith("data: ")) {
          continue;
        }

        const data = trimmedLine.replace("data: ", "");

        // Check for stream end
        if (data === "[DONE]") {
          return aiResponse;
        }

        // Skip empty data
        if (!data) {
          continue;
        }

        try {
          const parsed: OpenAIResponse = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || "";

          if (content) {
            aiResponse += content;

            const sseData: StreamChunk = {
              type: "chunk",
              content: content,
              accumulated: aiResponse,
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`)
            );
          }
        } catch (parseError) {
          // Log the problematic data for debugging, but don't throw
          console.warn(
            "Skipping malformed JSON chunk:",
            data.substring(0, 100) + "..."
          );
          continue;
        }
      }
    }
  } catch (error) {
    console.error("Error in Groq API handler:", error);
    throw error;
  } finally {
    reader.releaseLock();
  }

  return aiResponse;
};

// Enhanced Hugging Face Handler
const handleHuggingFaceAPI: APIHandler = async (
  message,
  selectedLLM,
  controller,
  encoder
) => {
  // Validate API key
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API key is not configured");
  }

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${selectedLLM}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          repetition_penalty: 1.1,
          return_full_text: false,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Hugging Face API request failed");
  }

  const data: HuggingFaceResponse[] = await response.json();
  const aiResponse =
    data[0]?.generated_text || "Sorry, I could not generate a response.";

  // Simulate streaming
  const words = aiResponse.split(" ");
  let currentChunk = "";

  for (let i = 0; i < words.length; i++) {
    currentChunk += (i > 0 ? " " : "") + words[i];

    const sseData: StreamChunk = {
      type: "chunk",
      content: words[i] + (i < words.length - 1 ? " " : ""),
      accumulated: currentChunk,
    };

    controller.enqueue(encoder.encode(`data: ${JSON.stringify(sseData)}\n\n`));
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
  }

  return aiResponse;
};

// Updated main POST handler
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, chatId, selectedLLM, selectedAPI } = await request.json();
    console.log("Received data:", {
      message,
      chatId,
      selectedLLM,
      selectedAPI,
    });

    if (!message || !chatId) {
      return NextResponse.json(
        { error: "Message and chatId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify chat belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        content: message,
        sender: "user",
        chatId: chatId,
        sessionId: chatId,
        role: "user",
      },
    });

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let aiResponse = "";

        try {
          const apiHandler = getAPIHandler(selectedAPI);
          aiResponse = await apiHandler(
            message,
            selectedLLM,
            controller,
            encoder
          );

          // Save bot message
          const botMessage = await prisma.message.create({
            data: {
              content: aiResponse,
              sender: "bot",
              chatId: chatId,
              sessionId: chatId,
              role: "bot",
              generatedBy: selectedLLM,
            },
          });

          // Update chat timestamp
          await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
          });

          // Update chat title if it's the first message
          const messageCount = await prisma.message.count({
            where: { chatId: chatId },
          });

          if (messageCount === 2 && chat.title === "New Chat") {
            const newTitle =
              message.length > 30 ? message.substring(0, 30) + "..." : message;
            await prisma.chat.update({
              where: { id: chatId },
              data: { title: newTitle },
            });
          }

          // Send completion message
          const completionData: StreamChunk = {
            type: "complete",
            botMessage: {
              id: botMessage.id,
              content: aiResponse,
              sender: botMessage.sender,
              timestamp: new Date(botMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            userMessage: {
              id: userMessage.id,
              content: userMessage.content,
              sender: userMessage.sender,
              timestamp: new Date(userMessage.createdAt).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              ),
            },
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(completionData)}\n\n`)
          );
        } catch (error) {
          console.error("Streaming error:", error);

          const errorMessage =
            "Sorry, there was an error generating the response.";

          // Save error message to database
          try {
            const botMessage = await prisma.message.create({
              data: {
                content: errorMessage,
                sender: "bot",
                chatId: chatId,
                sessionId: chatId,
                role: "bot",
                generatedBy: selectedLLM,
              },
            });

            // Update chat timestamp even for errors
            await prisma.chat.update({
              where: { id: chatId },
              data: { updatedAt: new Date() },
            });

            const errorData: StreamChunk = {
              type: "complete", // Changed from "error" to "complete" so it gets saved properly
              botMessage: {
                id: botMessage.id,
                content: errorMessage,
                sender: botMessage.sender,
                timestamp: new Date(botMessage.createdAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
              },
              userMessage: {
                id: userMessage.id,
                content: userMessage.content,
                sender: userMessage.sender,
                timestamp: new Date(userMessage.createdAt).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),
              },
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
            );
          } catch (dbError) {
            console.error("Error saving error message to database:", dbError);
            // Fallback to original error response if DB save fails
            const errorData: StreamChunk = {
              type: "error",
              message: errorMessage,
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
            );
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in streaming endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
