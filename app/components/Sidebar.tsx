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
  isCreatingChat: boolean;
  loadingChatId?: string | null;
  deletingChatId?: string | null;
  isUpdatingTitle?: boolean;
  isLoadingChats?: boolean;
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
  isCreatingChat,
  loadingChatId,
  deletingChatId,
  isUpdatingTitle,
  isLoadingChats,
}) => {
  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`lg:hidden fixed top-20 left-4 z-50 p-2 rounded-lg border border-neutral-700 ${
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
        } lg:translate-x-0 fixed lg:relative z-40 w-[200px] lg:w-[15%] h-full ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950"
            : "bg-neutral-200"
        } text-white transition-transform duration-300 ease-in-out`}
        style={{
          borderRight: theme === "dark" ? "0.5px solid #424242" : "",
        }}
      >
        <div className="flex flex-col h-full">
          <div
            className={`p-3 pt-3 ${
              theme === "dark" ? "border-neutral-700" : "border-neutral-300"
            }`}
          >
            <button
              onClick={createNewChat}
              disabled={isCreatingChat}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-neutral-700/80 hover:bg-neutral-600 disabled:bg-neutral-800 text-white"
                  : "bg-neutral-100 hover:bg-neutral-300 disabled:bg-neutral-200 text-neutral-800"
              } ${isCreatingChat ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isCreatingChat ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span className="font-medium">Creating...</span>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <IoAdd size={16} />
                  <span className="flex gap-1 xs:font-thin xl:font-medium">
                    New{" "}
                    <span className="sm:block lg:hidden xl:block"> Chat</span>
                  </span>
                </div>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {/* Loading chats indicator */}
            {isLoadingChats && (
              <div
                className={`flex items-center gap-2 px-3 py-2 text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Loading chats...</span>
              </div>
            )}

            {/* Title updating indicator */}
            {isUpdatingTitle && (
              <div
                className={`flex items-center gap-2 px-3 py-2 text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                <span>Updating title...</span>
              </div>
            )}

            {/* Chat list */}
            {chats.map((chat) => (
              <div key={chat.id} className="relative">
                {/* Individual chat loading overlay */}
                {(loadingChatId === chat.id || deletingChatId === chat.id) && (
                  <div
                    className={`absolute inset-0 z-10 flex items-center justify-center rounded-md ${
                      theme === "dark"
                        ? "bg-neutral-800/80"
                        : "bg-neutral-200/80"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      <span>
                        {loadingChatId === chat.id
                          ? "Loading..."
                          : "Deleting..."}
                      </span>
                    </div>
                  </div>
                )}

                <ChatListItem
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
                  // Pass loading states to ChatListItem
                  isLoading={loadingChatId === chat.id}
                  isDeleting={deletingChatId === chat.id}
                />
              </div>
            ))}

            {/* Empty state when no chats and not loading */}
            {!isLoadingChats && chats.length === 0 && (
              <div
                className={`text-center py-8 text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                }`}
              >
                No chats yet. Create your first chat!
              </div>
            )}
          </div>

          {/* Legal Links */}
          <div className="mt-auto pl-3 pb-4 text-xs sm:space-y-1 flex lg:gap-0 xl:gap-3">
            <a
              href="/terms-of-service"
              className={`block transition-colors hover:underline ${
                theme === "dark"
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              Terms of Service
            </a>
            <span
              className={`sm:hidden xl:block ${
                theme === "dark" ? "text-neutral-600" : "text-gray-400"
              }`}
            >
              •
            </span>
            <a
              href="/privacy-policy"
              className={`block transition-colors hover:underline ${
                theme === "dark"
                  ? "text-neutral-400 hover:text-white"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
