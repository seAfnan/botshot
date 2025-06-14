"use client";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useSession, signIn } from "next-auth/react";
import { ThemeContext } from "./Providers/ThemeContext";
import {
  IoSend,
  IoAdd,
  IoAttach,
  IoPerson,
  IoMenu,
  IoClose,
  IoTrash,
  IoCheckmark,
  IoCreate,
} from "react-icons/io5";
import { RiRobot2Fill } from "react-icons/ri";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  messages?: Message[];
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const context = useContext(ThemeContext);
  const { switchDark, switchLight, theme } = context ?? {};
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedLLM, setSelectedLLM] = useState("gpt-4");
  const [selectedAPI, setSelectedAPI] = useState("huggingface");
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

  const llmOptions = [
    { value: "gpt-4", label: "GPT-4" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
    { value: "claude-3", label: "Claude 3" },
    { value: "llama2", label: "Llama 2" },
  ];

  const apiOptions = [
    { value: "huggingface", label: "Hugging Face" },
    { value: "local", label: "Local (Ollama)" },
  ];

  // Fetch chats on component mount
  useEffect(() => {
    if (session) {
      fetchChats();
    }
  }, [session]);

  // Scroll to bottom when new messages are added
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Show login modal if user starts typing and not authenticated
    if (value.length > 0 && status !== "authenticated" && !showLoginModal) {
      setShowLoginModal(true);
    }

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const handleSendMessage = async () => {
    if (status !== "authenticated") {
      setShowLoginModal(true);
      return;
    }

    // if (!message.trim() && !selectedFile) return;
    // if (!message.trim()) return;
    if (!activeChat) return;

    setLoading(true);
    const messageToSend = message.trim();
    setMessage("");

    if (textareaRef.current) {
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
      loading: true,
    };

    // Optimistically show user's message
    setActiveChat((prev) =>
      prev
        ? {
            ...prev,
            messages: [...(prev.messages || []), tempUserMessage],
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

      if (response.ok) {
        const { userMessage, botMessage } = await response.json();

        // Update active chat with new messages
        // setActiveChat((prev) =>
        //   prev
        //     ? {
        //         ...prev,
        //         messages: [...(prev.messages || []), userMessage, botMessage],
        //       }
        //     : null
        // );
        setActiveChat((prev) =>
          prev
            ? {
                ...prev,
                messages: [
                  ...(prev.messages || []).slice(0, -1), // remove temp message
                  userMessage,
                  botMessage,
                ],
              }
            : null
        );

        // Refresh chats list to update last message
        fetchChats();
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
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

  return (
    <div
      className={`flex h-[90vh] ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`md:hidden fixed top-24 left-4 z-50 p-2 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {sidebarOpen ? (
          <IoClose
            size={20}
            className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
          />
        ) : (
          <IoMenu
            size={20}
            className={theme === "dark" ? "text-gray-300" : "text-gray-600"}
          />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-40 w-[280px] md:w-[15%] h-full ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        } text-white transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <div
            className={`p-3 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-300"
            }`}
          >
            <button
              onClick={createNewChat}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              <IoAdd size={16} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`group relative rounded-lg transition-colors ${
                  activeChat?.id === chat.id
                    ? theme === "dark"
                      ? "bg-gray-700"
                      : "bg-gray-300"
                    : theme === "dark"
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-200"
                }`}
              >
                {editingChatId === chat.id ? (
                  // Edit mode - no button wrapper, just the input container
                  <div className="p-2 pr-8">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveTitle();
                          if (e.key === "Escape") cancelEditing();
                        }}
                        onBlur={saveTitle}
                        className={`flex-1 text-sm bg-transparent border rounded px-1 ${
                          theme === "dark"
                            ? "text-white border-gray-600"
                            : "text-gray-800 border-gray-400"
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={saveTitle}
                        className={`p-1 ${
                          theme === "dark" ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        <IoCheckmark size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Normal mode - clickable button
                  <button
                    onClick={() => {
                      setActiveChat(chat);
                      fetchChatMessages(chat.id);
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-2 pr-8"
                  >
                    <div
                      className={`font-medium text-sm truncate ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {chat.title}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {chat.lastMessage}
                    </div>
                  </button>
                )}

                {/* Action buttons - only show when not editing */}
                {editingChatId !== chat.id && (
                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => startEditingTitle(chat, e)}
                      className={`p-1 rounded ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-gray-400 hover:text-gray-200"
                          : "hover:bg-gray-300 text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <IoCreate size={12} />
                    </button>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className={`p-1 rounded ${
                        theme === "dark"
                          ? "hover:bg-gray-600 text-red-400 hover:text-red-300"
                          : "hover:bg-gray-300 text-red-500 hover:text-red-700"
                      }`}
                    >
                      <IoTrash size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full md:w-[70%] relative">
        {/* Chat Messages - Fixed height container with scroll */}
        <div
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ paddingBottom: "180px" }}
        >
          {activeChat?.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <RiRobot2Fill size={16} />
                </div>
              )}
              <div
                className={`max-w-[80%] ${
                  msg.sender === "user" ? "order-1" : ""
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white ml-auto"
                      : theme === "dark"
                      ? "bg-gray-800 border border-gray-700 text-gray-100"
                      : "bg-white border text-gray-900"
                  }`}
                >
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
                <div
                  className={`text-xs mt-1 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  } ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  {msg.timestamp}
                </div>
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium order-2">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name ?? "User"}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold uppercase text-white">
                      {user?.name?.[0]?.toUpperCase() || <IoPerson size={16} />}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                <RiRobot2Fill size={16} />
              </div>
              <div className="max-w-[80%]">
                <div
                  className={`p-3 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-800 border border-gray-700 text-gray-100"
                      : "bg-white border text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(!activeChat?.messages || activeChat.messages.length === 0) &&
            !loading && (
              <div
                className={`text-center mt-20 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <RiRobot2Fill
                  size={48}
                  className={`mx-auto mb-4 ${
                    theme === "dark" ? "text-gray-600" : "text-gray-300"
                  }`}
                />
                <h3 className="text-lg font-medium mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm">
                  Send a message to begin chatting with your AI assistant
                </p>
              </div>
            )}
        </div>

        {/* Input Area - Fixed at bottom */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 pb-1 border-t ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            {/* File Upload Display */}
            {selectedFile && (
              <div
                className={`mb-3 p-2 rounded-lg flex items-center justify-between ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <span
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {selectedFile.name}
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className={`${
                    theme === "dark"
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <IoClose size={16} />
                </button>
              </div>
            )}

            {/* Message Input Row */}
            <div className="flex gap-3 items-center">
              {/* Text Input Area */}
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Write something..."
                    disabled={loading}
                    className={`w-full p-2 pr-20 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px] scrollbar-hide overflow-hidden text-lg ${
                      theme === "dark"
                        ? "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    rows={1}
                  />
                  <div className="absolute right-2 bottom-2 flex gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className={`p-1.5 rounded ${
                        loading
                          ? "cursor-not-allowed opacity-50"
                          : theme === "dark"
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <IoAttach size={18} />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={(!message.trim() && !selectedFile) || loading}
                      className={`p-1.5 rounded ${
                        (message.trim() || selectedFile) && !loading
                          ? "text-blue-500 hover:text-blue-600"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <IoSend size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex gap-2">
                {/* API Type Dropdown */}
                <select
                  value={selectedAPI}
                  onChange={(e) => setSelectedAPI(e.target.value)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-800 text-gray-100"
                      : "border-gray-300 bg-white text-gray-900"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {apiOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* LLM Dropdown */}
                <select
                  value={selectedLLM}
                  onChange={(e) => setSelectedLLM(e.target.value)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px] ${
                    theme === "dark"
                      ? "border-gray-600 bg-gray-800 text-gray-100"
                      : "border-gray-300 bg-white text-gray-900"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {llmOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-lg p-6 w-full max-w-md ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="text-center">
              <h2
                className={`text-xl font-semibold mb-4 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Sign in to continue
              </h2>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                You need to sign in to start chatting with your AI assistant.
              </p>
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mb-3"
              >
                Sign in with Google
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className={`w-full py-2 ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
