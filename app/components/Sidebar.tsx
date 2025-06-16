"use client";
import React from "react";
import { IoAdd, IoClose, IoMenu } from "react-icons/io5";
import ChatListItem from "./ChatListItem";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  messages?: any[];
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme?: string;
  chats: Chat[];
  activeChat: Chat | null;
  createNewChat: () => void;
  setActiveChat: (chat: Chat) => void;
  fetchChatMessages: (chatId: string) => void;
  deleteChat: (chatId: string, e: React.MouseEvent) => void;
  editingChatId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  startEditingTitle: (chat: Chat, e: React.MouseEvent) => void;
  saveTitle: () => void;
  cancelEditing: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  theme,
  chats,
  activeChat,
  createNewChat,
  setActiveChat,
  fetchChatMessages,
  deleteChat,
  editingChatId,
  editTitle,
  setEditTitle,
  startEditingTitle,
  saveTitle,
  cancelEditing,
}) => {
  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-neutral-900/70" : "bg-white"
        }`}
      >
        {sidebarOpen ? (
          <IoClose
            size={20}
            className={
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }
          />
        ) : (
          <IoMenu
            size={20}
            className={
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }
          />
        )}
      </button>
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:relative z-40 w-[200px] md:w-[15%] h-full ${
          theme === "dark" ? "bg-neutral-900/70" : "bg-neutral-200"
        } text-white transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div
            className={`p-3 border-b pt-6 ${
              theme === "dark" ? "border-neutral-700" : "border-neutral-300"
            }`}
          >
            <button
              onClick={createNewChat}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-neutral-700/80 hover:bg-neutral-600 text-white"
                  : "bg-neutral-100 hover:bg-neutral-300 text-neutral-800"
              }`}
            >
              <IoAdd size={16} />
              <span className="font-medium">New Chat</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {chats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                activeChat={activeChat}
                theme={theme}
                editingChatId={editingChatId}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                startEditingTitle={startEditingTitle}
                saveTitle={saveTitle}
                cancelEditing={cancelEditing}
                setActiveChat={setActiveChat}
                fetchChatMessages={fetchChatMessages}
                deleteChat={deleteChat}
                setSidebarOpen={setSidebarOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
