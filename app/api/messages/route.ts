import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST - Send message and get AI response
export async function POST(request: NextRequest) {
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

    const userMessage = await prisma.message.create({
      data: {
        content: message,
        sender: "user", // Keep this
        chatId: chatId, // Add this
        sessionId: chatId, // Keep this
        role: "user",
      },
    });

    // Get AI response
    let aiResponse = "";

    if (selectedAPI === "local") {
      // Call local Ollama API
      try {
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedLLM || "llama2", // Default to llama2 if not specified
            prompt: message,
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          aiResponse =
            data.response || "Sorry, I could not generate a response.";
        } else {
          aiResponse = "Sorry, the local AI service is not available.";
        }
      } catch (error) {
        console.error("Ollama API error:", error);
        aiResponse =
          "Sorry, there was an error connecting to the local AI service.";
      }
    } else if (selectedAPI === "huggingface") {
      // Call Hugging Face API
      try {
        const response = await fetch(
          `https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: message,
              parameters: {
                max_new_tokens: 1024, // 🧠 Generate more content (max supported by most 7B models)
                temperature: 1.0, // 🎨 Balanced creativity
                repetition_penalty: 1.1, // 🚫 Avoid repeating phrases
                return_full_text: false, // ✅ Return only the generated answer
              },
            }),
          }
        );

        console.log("Hugging Face response:", response);
        if (response.ok) {
          const data = await response.json();
          aiResponse =
            data[0]?.generated_text ||
            "Sorry, I could not generate a response.";
        } else {
          aiResponse = "Sorry, the Hugging Face service is not available.";
        }
      } catch (error) {
        console.error("Hugging Face API error:", error);
        aiResponse =
          "Sorry, there was an error connecting to the Hugging Face service.";
      }
    }

    const botMessage = await prisma.message.create({
      data: {
        content: aiResponse,
        sender: "bot", // Keep this
        chatId: chatId, // Add this
        sessionId: chatId, // Keep this
        role: "user",
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

    return NextResponse.json({
      userMessage: {
        id: userMessage.id,
        content: userMessage.content,
        sender: userMessage.sender,
        timestamp: new Date(userMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      botMessage: {
        id: botMessage.id,
        content: botMessage.content,
        sender: botMessage.sender,
        timestamp: new Date(botMessage.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
