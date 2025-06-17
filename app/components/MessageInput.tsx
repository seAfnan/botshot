"use client";
import React, { RefObject, useCallback, useRef } from "react";
import { IoAttach, IoSend, IoClose } from "react-icons/io5";

interface MessageInputProps {
  theme?: string;
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
}

const MessageInput: React.FC<MessageInputProps> = ({
  theme,
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
}) => {
  const handleInputChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    messageRef.current = textarea.value;

    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  }, []);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    [setSelectedFile]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, [setSelectedFile]);

  const handleAttachClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const canSend = (messageRef.current?.trim() || selectedFile) && !loading;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 pb-0 pt-0">
      {/* Selected File Display */}
      {selectedFile && (
        <div
          className={`mb-3 p-2 rounded-lg flex items-center justify-between ${
            theme === "dark" ? "bg-neutral-800" : "bg-neutral-100"
          }`}
        >
          <span
            className={`text-sm ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-700"
            }`}
          >
            {selectedFile.name}
          </span>
          <button
            onClick={handleRemoveFile}
            className={`${
              theme === "dark"
                ? "text-neutral-400 hover:text-neutral-200"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <IoClose size={16} />
          </button>
        </div>
      )}

      {/* Main Input Container */}
      <div
        className={`border rounded-xl rounded-bl-none rounded-br-none ${
          theme === "dark"
            ? "border-neutral-600 bg-neutral-800"
            : "border-neutral-400 bg-white"
        } focus-within:border-blue-500 transition-colors`}
      >
        {/* Text Input Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            onInput={handleInputChange}
            onKeyDown={handleKeyPress}
            defaultValue=""
            placeholder="Type your message here..."
            disabled={loading}
            className={`w-full p-3 pr-12 bg-transparent resize-none focus:outline-none min-h-[48px] max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-400 scrollbar-track-transparent ${
              theme === "dark"
                ? "text-neutral-100 placeholder-neutral-400"
                : "text-neutral-900 placeholder-neutral-500"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            rows={1}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "transparent transparent",
            }}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {/* <button
              onClick={handleAttachClick}
              disabled={loading}
              className={`p-2 rounded-lg transition-colors ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : theme === "dark"
                  ? "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <IoAttach size={20} />
            </button> */}

            <button
              onClick={handleSendMessage}
              disabled={!canSend}
              className={`p-2 rounded-lg transition-colors ${
                canSend
                  ? theme === "dark"
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "bg-black text-white hover:bg-neutral-800"
                  : theme === "dark"
                  ? "bg-neutral-700 text-neutral-500 cursor-not-allowed"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <IoSend size={14} />
            </button>
          </div>
        </div>

        {/* Dropdowns Section */}
        <div className="px-3 py-2 flex justify-start gap-3">
          <select
            value={selectedAPI}
            onChange={(e) => setSelectedAPI(e.target.value)}
            disabled={loading}
            className={`px-2 py-1 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 ${
              theme === "dark"
                ? "border-neutral-600 bg-neutral-700 text-neutral-200"
                : "border-neutral-300 bg-neutral-50 text-neutral-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {apiOptions.map((option) => (
              <option
                className="rounded-sm"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={selectedLLM}
            onChange={(e) => setSelectedLLM(e.target.value)}
            disabled={loading}
            className={`px-2 py-1 text-xs border rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 ${
              theme === "dark"
                ? "border-neutral-600 bg-neutral-700 text-neutral-200"
                : "border-neutral-300 bg-neutral-50 text-neutral-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {getLLMOptions().map((option) => (
              <option
                className="rounded-sm"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  );
};

export default MessageInput;
