"use client";
import React from "react";
import { IoCreate, IoTrash, IoCheckmark } from "react-icons/io5";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  messages?: any[];
}

interface ChatListItemProps {
  chat: Chat;
  activeChat: Chat | null;
  theme?: string;
  editingChatId: string | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  startEditingTitle: (chat: Chat, e: React.MouseEvent) => void;
  saveTitle: () => void;
  cancelEditing: () => void;
  setActiveChat: (chat: Chat) => void;
  fetchChatMessages: (chatId: string) => void;
  deleteChat: (chatId: string, e: React.MouseEvent) => void;
  setSidebarOpen: (open: boolean) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  activeChat,
  theme,
  editingChatId,
  editTitle,
  setEditTitle,
  startEditingTitle,
  saveTitle,
  cancelEditing,
  setActiveChat,
  fetchChatMessages,
  deleteChat,
  setSidebarOpen,
  isLoading,
  isDeleting,
}) => {
  return (
    <div
      className={`group relative rounded-md transition-colors ${
        activeChat?.id === chat.id
          ? theme === "dark"
            ? "bg-neutral-700/50"
            : "bg-neutral-300"
          : theme === "dark"
          ? "hover:bg-neutral-700"
          : "bg-neutral-100 hover:bg-neutral-300"
      } ${isDeleting ? "opacity-50" : ""}`}
    >
      {editingChatId === chat.id ? (
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
                  ? "text-white border-neutral-600"
                  : "text-neutral-800 border-neutral-400"
              }`}
              autoFocus
              disabled={isLoading}
            />
            <button
              onClick={saveTitle}
              disabled={isLoading}
              className={`p-1 ${
                theme === "dark" ? "text-green-400" : "text-green-600"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <div className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" />
              ) : (
                <IoCheckmark size={12} />
              )}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setActiveChat(chat);
            fetchChatMessages(chat.id);
            setSidebarOpen(false);
          }}
          disabled={isLoading || isDeleting}
          className={`w-full text-left p-2 pr-8 ${
            isLoading || isDeleting ? "cursor-not-allowed" : ""
          }`}
        >
          <div
            className={`font-medium text-sm truncate ${
              theme === "dark" ? "text-white" : "text-neutral-800"
            }`}
          >
            {chat.title}
            {isLoading && (
              <span className="ml-2 inline-block animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" />
            )}
          </div>
          <div
            className={`text-xs mt-1 ${
              theme === "dark" ? "text-neutral-400" : "text-neutral-500"
            }`}
          >
            {isDeleting ? "Deleting..." : chat.lastMessage}
          </div>
        </button>
      )}
      {editingChatId !== chat.id && (
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={(e) => startEditingTitle(chat, e)}
            disabled={isLoading || isDeleting}
            className={`p-1 rounded ${
              theme === "dark"
                ? "hover:bg-neutral-600 text-neutral-400 hover:text-neutral-200"
                : "hover:bg-neutral-300 text-neutral-500 hover:text-neutral-700"
            } ${
              isLoading || isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <IoCreate size={12} />
          </button>
          <button
            onClick={(e) => deleteChat(chat.id, e)}
            disabled={isLoading || isDeleting}
            className={`p-1 rounded ${
              theme === "dark"
                ? "hover:bg-neutral-600 text-red-400 hover:text-red-300"
                : "hover:bg-neutral-300 text-red-500 hover:text-red-700"
            } ${
              isLoading || isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? (
              <div className="animate-spin w-3 h-3 border border-current border-t-transparent rounded-full" />
            ) : (
              <IoTrash size={12} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatListItem;
