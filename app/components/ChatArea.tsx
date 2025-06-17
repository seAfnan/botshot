"use client";
import React, { RefObject, useState, useEffect } from "react";
import { Session } from "next-auth";
import { IoPerson } from "react-icons/io5";
import { RiRobot2Fill } from "react-icons/ri";
import { IoChevronDown } from "react-icons/io5";
import BotMessageRenderer from "./BotMessageRenderer";
import MessageInput from "./MessageInput";
import { Chat, Message } from "../types";

interface ChatAreaProps {
  activeChat: Chat | null;
  chatMessagesRef: RefObject<HTMLDivElement | null>;
  theme?: "light" | "dark";
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
  loading: boolean;
  messageRef: RefObject<string | null>;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  selectedAPI: string;
  setSelectedAPI: (api: string) => void;
  selectedLLM: string;
  setSelectedLLM: (llm: string) => void;
  apiOptions: { value: string; label: string }[];
  getLLMOptions: () => { value: string; label: string }[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  handleSendMessage: () => void;
  loadingChatId?: string | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  activeChat,
  chatMessagesRef,
  theme,
  session,
  status,
  loading,
  messageRef,
  selectedFile,
  setSelectedFile,
  selectedAPI,
  setSelectedAPI,
  selectedLLM,
  setSelectedLLM,
  apiOptions,
  getLLMOptions,
  fileInputRef,
  textareaRef,
  handleSendMessage,
  loadingChatId,
}) => {
  const user = session?.user;
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check if user has scrolled up from bottom
  const checkScrollPosition = () => {
    if (chatMessagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      setShowScrollButton(!isAtBottom && scrollHeight > clientHeight);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeChat?.messages && chatMessagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

      // Only auto-scroll if user is near the bottom
      if (isNearBottom) {
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    }
  }, [activeChat?.messages]);

  // Add scroll listener
  useEffect(() => {
    const chatContainer = chatMessagesRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", checkScrollPosition);
      // Initial check
      checkScrollPosition();

      return () => {
        chatContainer.removeEventListener("scroll", checkScrollPosition);
      };
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full md:w-[70%] relative">
      <div
        ref={chatMessagesRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 overflow-auto"
        style={{ paddingBottom: "180px" }}
      >
        {loadingChatId && (
          <div className="text-center">Loading chat messages...</div>
        )}
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
                    ? theme === "dark"
                      ? "bg-neutral-600/60 border border-neutral-700 text-white ml-auto"
                      : "bg-neutral-300 text-neutral-900 ml-auto"
                    : theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700 text-neutral-100"
                    : "bg-neutral-200 border border-neutral-300 text-neutral-900"
                }`}
              >
                {msg.sender === "user" ? (
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <BotMessageRenderer
                    content={msg.content}
                    theme={theme || "light"}
                    streaming={msg.streaming}
                  />
                )}
              </div>
              <div
                className={`text-xs mt-1 ${
                  msg.sender === "user" ? "text-right" : "text-left"
                } ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                <p>
                  {msg.timestamp}
                  {msg.sender === "bot" && (
                    <>
                      {" - "}
                      <span>Generated by {msg.generatedBy}</span>
                    </>
                  )}
                </p>
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
                  <div className="w-9 h-9 bg-neutral-700 rounded-full flex items-center justify-center text-sm font-semibold uppercase text-white">
                    {user?.name?.[0]?.toUpperCase() || <IoPerson size={16} />}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loading && activeChat?.messages?.length === 0 && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              <RiRobot2Fill size={16} />
            </div>
            <div className="max-w-[80%]">
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark"
                    ? "bg-neutral-800 border border-neutral-700 text-neutral-100"
                    : "bg-white border text-neutral-900"
                }`}
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"
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
                theme === "dark" ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              <RiRobot2Fill
                size={48}
                className={`mx-auto mb-4 ${
                  theme === "dark" ? "text-neutral-600" : "text-neutral-300"
                }`}
              />
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p className="text-sm">
                Send a message to begin chatting with your AI assistant
              </p>
            </div>
          )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className={`fixed bottom-28 right-20 w-10 h-10 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10 ${
            theme === "dark"
              ? "bg-neutral-900 hover:bg-neutral-600 text-white border border-neutral-600"
              : "bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200"
          }`}
          aria-label="Scroll to bottom"
        >
          <IoChevronDown size={16} className="mx-auto" />
        </button>
      )}

      <MessageInput
        theme={theme}
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
    </div>
  );
};

export default ChatArea;
