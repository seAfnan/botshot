"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ThemeContext } from "./Providers/ThemeContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import LoginModal from "./components/LoginModal";
import { Chat, Message } from "./types";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const { switchDark, switchLight, theme } = useContext(ThemeContext) ?? {};
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState("llama3-8b-8192");
  const [selectedAPI, setSelectedAPI] = useState("groq");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef("");
  const [isInitialized, setIsInitialized] = useState(false);

  const getLLMOptions = () => {
    switch (selectedAPI) {
      case "groq":
        return [
          { value: "llama3-70b-8192", label: "Llama 3 70B" },
          { value: "llama3-8b-8192", label: "Llama 3 8B" },
        ];
      case "local":
        return [{ value: "llama2", label: "Llama 2" }];
      case "huggingface":
        return [
          { value: "HuggingFaceH4/zephyr-7b-beta", label: "Zephyr 7B Beta" },
        ];
      case "openai":
        return [
          { value: "gpt-4", label: "GPT-4" },
          { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
        ];
      case "anthropic":
        return [
          { value: "claude-3-opus", label: "Claude 3 Opus" },
          { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
          { value: "claude-3-haiku", label: "Claude 3 Haiku" },
        ];
      default:
        return [{ value: "llama2", label: "Llama 2" }];
    }
  };

  const apiOptions = [
    { value: "local", label: "Local (Ollama)" },
    { value: "huggingface", label: "Hugging Face" },
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "groq", label: "Groq" },
  ];

  useEffect(() => {
    const availableOptions = getLLMOptions();
    if (availableOptions.length > 0) {
      setSelectedLLM(availableOptions[0].value);
    }
  }, [selectedAPI]);

  // Show login modal on page load if user is not authenticated
  useEffect(() => {
    let timeoutId;

    if (status === "loading") {
      setIsInitialized(false);
      return;
    }

    timeoutId = setTimeout(() => {
      setIsInitialized(true);
      if (status === "unauthenticated") {
        setShowLoginModal(true);
      } else if (status === "authenticated") {
        setShowLoginModal(false);
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [status]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (response.ok) {
        const fetchedChats = await response.json();
        setChats(fetchedChats);
        if (fetchedChats.length > 0 && !activeChat) {
          setActiveChat(fetchedChats[0]);
          fetchChatMessages(fetchedChats[0].id);
        } else if (fetchedChats.length === 0) {
          createNewChat();
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const chatData = await response.json();
        setActiveChat(chatData);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (status !== "authenticated") {
      setShowLoginModal(true);
      return;
    }

    const messageToSend = messageRef.current.trim();
    if (!messageToSend) return;
    if (!activeChat) return;

    setLoading(true);
    messageRef.current = "";

    if (textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.style.height = "auto";
    }

    const tempUserMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      sender: "user" as const,
    };

    const tempBotMessageId = (Date.now() + 1).toString();
    const tempBotMessage = {
      id: tempBotMessageId,
      content: "",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      sender: "bot" as const,
      streaming: true,
      generatedBy: selectedLLM,
    };

    setActiveChat((prev) =>
      prev
        ? {
            ...prev,
            messages: [
              ...(prev.messages || []),
              tempUserMessage,
              tempBotMessage,
            ],
          }
        : null
    );

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          chatId: activeChat.id,
          selectedLLM,
          selectedAPI,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      console.log(response.body);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "chunk") {
                accumulatedContent = data.accumulated;

                setActiveChat((prev) => {
                  if (!prev) return null;

                  const updatedMessages =
                    prev.messages?.map((msg) =>
                      msg.id === tempBotMessageId
                        ? {
                            ...msg,
                            content: accumulatedContent,
                            streaming: true,
                            generatedBy: selectedLLM,
                          }
                        : msg
                    ) || [];

                  return {
                    ...prev,
                    messages: updatedMessages,
                  };
                });
              } else if (data.type === "complete") {
                setActiveChat((prev) => {
                  if (!prev) return null;

                  const updatedMessages =
                    prev.messages?.map((msg) =>
                      msg.id === tempBotMessageId
                        ? {
                            ...data.botMessage,
                            streaming: false,
                            generatedBy: selectedLLM,
                          }
                        : msg
                    ) || [];

                  return {
                    ...prev,
                    messages: updatedMessages,
                  };
                });

                fetchChats();
              } else if (data.type === "error") {
                setActiveChat((prev) => {
                  if (!prev) return null;

                  const updatedMessages =
                    prev.messages?.map((msg) =>
                      msg.id === tempBotMessageId
                        ? {
                            ...msg,
                            content:
                              data.message || "Sorry, there was an error.",
                            streaming: false,
                            generatedBy: selectedLLM,
                          }
                        : msg
                    ) || [];

                  return {
                    ...prev,
                    messages: updatedMessages,
                  };
                });
              }
            } catch (parseError) {
              console.error("Error parsing SSE data:", parseError);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error with streaming:", error);

      setActiveChat((prev) => {
        if (!prev) return null;

        const updatedMessages =
          prev.messages?.map((msg) =>
            msg.id === tempBotMessageId
              ? {
                  ...msg,
                  content: "Sorry, there was an error generating the response.",
                  streaming: false,
                  generatedBy: selectedLLM,
                }
              : msg
          ) || [];

        return {
          ...prev,
          messages: updatedMessages,
        };
      });
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    }
  };

  const createNewChat = async () => {
    if (status !== "authenticated") {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats((prev) => [newChat, ...prev]);
        setActiveChat({ ...newChat, messages: [] });
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));

        if (activeChat?.id === chatId) {
          const remainingChats = chats.filter((chat) => chat.id !== chatId);
          if (remainingChats.length > 0) {
            setActiveChat(remainingChats[0]);
            fetchChatMessages(remainingChats[0].id);
          } else {
            setActiveChat(null);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const startEditingTitle = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const saveTitle = async () => {
    if (!editingChatId || !editTitle.trim()) return;

    try {
      const response = await fetch(`/api/chats/${editingChatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle.trim() }),
      });

      if (response.ok) {
        const updatedChat = await response.json();
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === editingChatId
              ? { ...chat, title: updatedChat.title }
              : chat
          )
        );

        if (activeChat?.id === editingChatId) {
          setActiveChat((prev) =>
            prev ? { ...prev, title: updatedChat.title } : null
          );
        }
      }
    } catch (error) {
      console.error("Error updating chat title:", error);
    } finally {
      setEditingChatId(null);
      setEditTitle("");
    }
  };

  const cancelEditing = () => {
    setEditingChatId(null);
    setEditTitle("");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add this early return
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`flex flex-col h-screen ${
          theme === "dark" ? "bg-neutral-800" : "bg-neutral-50"
        } ${showLoginModal ? "blur-sm" : ""}`}
      >
        <Header
          session={session}
          status={status}
          theme={theme}
          switchDark={switchDark}
          switchLight={switchLight}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          dropdownRef={dropdownRef}
        />
        <div className="flex flex-grow overflow-auto relative">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            theme={theme}
            chats={chats}
            activeChat={activeChat}
            createNewChat={createNewChat}
            setActiveChat={setActiveChat}
            fetchChatMessages={fetchChatMessages}
            deleteChat={deleteChat}
            editingChatId={editingChatId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            startEditingTitle={startEditingTitle}
            saveTitle={saveTitle}
            cancelEditing={cancelEditing}
          />
          <ChatArea
            activeChat={activeChat}
            chatMessagesRef={chatMessagesRef}
            theme={theme}
            session={session}
            status={status}
            loading={loading}
            messageRef={messageRef}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            selectedAPI={selectedAPI}
            setSelectedAPI={setSelectedAPI}
            selectedLLM={selectedLLM}
            setSelectedLLM={setSelectedLLM}
            apiOptions={apiOptions}
            getLLMOptions={getLLMOptions}
            fileInputRef={fileInputRef}
            textareaRef={textareaRef}
            handleSendMessage={handleSendMessage}
          />
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-opacity-50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </div>
      {showLoginModal && (
        <LoginModal
          theme={theme}
          setShowLoginModal={setShowLoginModal}
          handleGoogleLogin={() => signIn("google", { callbackUrl: "/" })}
        />
      )}
    </>
  );
};

export default Dashboard;
