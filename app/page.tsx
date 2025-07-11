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

  // New loading states
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

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
          { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
          { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
          { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
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
    const validLLMValues = availableOptions.map((option) => option.value);
    if (availableOptions.length > 0 && !validLLMValues.includes(selectedLLM)) {
      setSelectedLLM(availableOptions[0].value);
    }
  }, [selectedAPI, selectedLLM]);

  // Initialize the app without showing login modal
  useEffect(() => {
    let timeoutId;

    if (status === "loading") {
      setIsInitialized(false);
      return;
    }

    timeoutId = setTimeout(() => {
      setIsInitialized(true);
      // Remove the automatic login modal display
      // if (status === "unauthenticated") {
      //   setShowLoginModal(true);
      // } else if (status === "authenticated") {
      //   setShowLoginModal(false);
      // }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [status]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  const fetchChats = async () => {
    setIsLoadingChats(true);
    try {
      const response = await fetch("/api/chats");
      if (response.ok) {
        const fetchedChats = await response.json();
        setChats(fetchedChats);

        // If no chats exist, create a new one
        if (fetchedChats.length === 0) {
          await createNewChatInternal(); // Use internal version that doesn't check auth
        } else if (!activeChat) {
          // If chats exist but no active chat, set the first one as active
          setActiveChat(fetchedChats[0]);
          await fetchChatMessages(fetchedChats[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const createNewChatInternal = async () => {
    setIsCreatingChat(true);
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
      });

      if (response.ok) {
        const newChat = await response.json();
        setChats((prev) => [newChat, ...prev]);
        setActiveChat({ ...newChat, messages: [] });
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    setLoadingChatId(chatId);
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const chatData = await response.json();
        setActiveChat(chatData);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setLoadingChatId(null);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && isInitialized) {
      fetchChats();
    }
  }, [status, isInitialized]);

  const handleSendMessage = async () => {
    // Check authentication only when user tries to send a message
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

                // Update the chat in the chats list with the new last message
                setChats((prevChats) =>
                  prevChats.map((chat) =>
                    chat.id === activeChat.id
                      ? {
                          ...chat,
                          lastMessage:
                            data.botMessage.content.slice(0, 100) + "...", // Truncate for preview
                        }
                      : chat
                  )
                );
                // fetchChats();
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

    await createNewChatInternal();
    setSidebarOpen(false);
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    setDeletingChatId(chatId);
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
    } finally {
      setDeletingChatId(null);
    }
  };

  const startEditingTitle = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const saveTitle = async () => {
    if (!editingChatId || !editTitle.trim()) return;

    setIsUpdatingTitle(true);
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
      setIsUpdatingTitle(false);
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

  const handleSetSelectedLLM = (llm: string) => {
    setSelectedLLM(llm);
  };

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
          theme === "dark"
            ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
            : "bg-neutral-50"
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
            isCreatingChat={isCreatingChat}
            loadingChatId={loadingChatId}
            deletingChatId={deletingChatId}
            isUpdatingTitle={isUpdatingTitle}
            isLoadingChats={isLoadingChats}
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
            setSelectedLLM={handleSetSelectedLLM}
            apiOptions={apiOptions}
            getLLMOptions={getLLMOptions}
            fileInputRef={fileInputRef}
            textareaRef={textareaRef}
            handleSendMessage={handleSendMessage}
            loadingChatId={loadingChatId}
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
        <LoginModal theme={theme} setShowLoginModal={setShowLoginModal} />
      )}
    </>
  );
};

export default Dashboard;
