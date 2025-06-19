"use client";
import React, {
  RefObject,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { IoAttach, IoSend, IoClose, IoChevronDown } from "react-icons/io5";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get LLM options for a specific API
  const getLLMOptionsForAPI = useCallback((apiValue: string) => {
    switch (apiValue) {
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
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHoveredProvider(null);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleProviderLLMSelection = useCallback(
    (api: string, llm: string) => {
      setSelectedAPI(api);
      setSelectedLLM(llm);
      setIsDropdownOpen(false);
      setHoveredProvider(null);
    },
    [setSelectedAPI, setSelectedLLM]
  );

  const getCurrentCombinedValue = useCallback(() => {
    return `${selectedAPI}:${selectedLLM}`;
  }, [selectedAPI, selectedLLM]);

  // Get display text for selected provider-model combination
  const getDisplayText = useCallback(() => {
    const providerLabel =
      apiOptions.find((api) => api.value === selectedAPI)?.label || selectedAPI;
    const modelLabel =
      getLLMOptions().find((llm) => llm.value === selectedLLM)?.label ||
      selectedLLM;
    return { providerLabel, modelLabel };
  }, [selectedAPI, selectedLLM, apiOptions, getLLMOptions]);

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
    <>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideOutDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
        }
      `}</style>
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

          {/* Combined Model Selector */}
          <div className="px-3 py-1 flex flex-wrap gap-3 items-center">
            <div className="relative w-auto" ref={dropdownRef}>
              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
                  disabled={loading}
                  className={`w-full flex items-center justify-between pl-3 pr-3 py-2 text-left rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm ${
                    theme === "dark"
                      ? "bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700"
                      : "bg-white border-neutral-300 text-gray-900 hover:bg-gray-50"
                  } 
                ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-sm truncate ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <span className="font-medium">
                        {getDisplayText().providerLabel}
                      </span>
                      <span className="font-light">
                        {" "}
                        - {getDisplayText().modelLabel}
                      </span>
                    </div>
                  </div>

                  <IoChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Options - Two Panel Design */}
                {isDropdownOpen && (
                  <div
                    className={`absolute bottom-full left-0 z-50 mb-1 rounded-md border shadow-lg flex transition-all duration-200 ease-out transform ${
                      isDropdownOpen
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    } ${
                      theme === "dark"
                        ? "bg-neutral-800 border-neutral-600"
                        : "bg-white border-neutral-300"
                    }`}
                    style={{
                      animation: isDropdownOpen
                        ? "slideInUp 0.2s ease-out"
                        : "slideOutDown 0.2s ease-in",
                    }}
                  >
                    {/* Providers Panel */}
                    <div
                      className={`w-48 border-r ${
                        theme === "dark"
                          ? "border-neutral-600"
                          : "border-neutral-200"
                      }`}
                    >
                      <div
                        className={`px-3 py-2 text-xs font-medium border-b ${
                          theme === "dark"
                            ? "text-neutral-400 border-neutral-600"
                            : "text-gray-500 border-gray-200"
                        }`}
                      >
                        Providers
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {apiOptions.map((provider) => (
                          <div
                            key={provider.value}
                            onMouseEnter={() =>
                              setHoveredProvider(provider.value)
                            }
                            className={`px-3 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                              selectedAPI === provider.value
                                ? theme === "dark"
                                  ? "bg-neutral-700 text-white"
                                  : "bg-blue-50 text-blue-900"
                                : hoveredProvider === provider.value
                                ? theme === "dark"
                                  ? "bg-neutral-700 text-white"
                                  : "bg-gray-50 text-gray-900"
                                : theme === "dark"
                                ? "text-neutral-200 hover:bg-neutral-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {provider.label}
                            </span>
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Models Panel */}
                    {hoveredProvider && (
                      <div className="w-48">
                        <div
                          className={`px-3 py-2 text-xs font-medium border-b ${
                            theme === "dark"
                              ? "text-neutral-400 border-neutral-600"
                              : "text-gray-500 border-gray-200"
                          }`}
                        >
                          Models
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {getLLMOptionsForAPI(hoveredProvider).map((model) => (
                            <div
                              key={model.value}
                              onClick={() =>
                                handleProviderLLMSelection(
                                  hoveredProvider,
                                  model.value
                                )
                              }
                              className={`px-3 py-3 cursor-pointer transition-colors ${
                                selectedAPI === hoveredProvider &&
                                selectedLLM === model.value
                                  ? theme === "dark"
                                    ? "bg-neutral-700 text-white"
                                    : "bg-blue-50 text-blue-900"
                                  : theme === "dark"
                                  ? "text-neutral-200 hover:bg-neutral-700"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <span className="text-sm">{model.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
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
    </>
  );
};

export default MessageInput;
