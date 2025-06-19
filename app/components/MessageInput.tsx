"use client";
import React, {
  RefObject,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { IoSend, IoClose, IoChevronDown } from "react-icons/io5";

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
  fileInputRef,
  textareaRef,
  handleSendMessage,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const isSelecting = useRef(false);

  // Define LLM options per API
  const getLLMOptionsForAPI = useCallback((apiValue: string) => {
    const options: { value: string; label: string }[] = {
      groq: [
        { value: "llama3-70b-8192", label: "Llama 3 70B" },
        { value: "llama3-8b-8192", label: "Llama 3 8B" },
      ],
      local: [{ value: "llama2", label: "Llama 2" }],
      huggingface: [
        { value: "HuggingFaceH4/zephyr-7b-beta", label: "Zephyr 7B Beta" },
      ],
      openai: [
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
      ],
      anthropic: [
        { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
        { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
        { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
      ],
    }[apiValue] || [{ value: "llama2", label: "Llama 2" }];
    return options;
  }, []);

  // Generate all provider-model combinations
  const getAllCombinations = useCallback(() => {
    const combinations: Array<{
      id: string;
      providerValue: string;
      providerLabel: string;
      modelValue: string;
      modelLabel: string;
      displayLabel: string;
    }> = [];
    apiOptions.forEach((provider) => {
      const models = getLLMOptionsForAPI(provider.value);
      models.forEach((model) => {
        combinations.push({
          id: `${provider.value}:${model.value}`,
          providerValue: provider.value,
          providerLabel: provider.label,
          modelValue: model.value,
          modelLabel: model.label,
          displayLabel: `${provider.label} - ${model.label}`,
        });
      });
    });
    return combinations;
  }, [apiOptions, getLLMOptionsForAPI]);

  // Handle selection
  const handleCombinationSelection = useCallback(
    (id: string) => {
      if (isSelecting.current) return;
      isSelecting.current = true;

      const combination = getAllCombinations().find((combo) => combo.id === id);
      if (combination) {
        setSelectedAPI(combination.providerValue);
        setSelectedLLM(combination.modelValue);
        if (combination.providerValue === "openai") {
          console
            .log
            // `Selected OpenAI model: ${combination.modelLabel} (${combination.modelValue})`
            ();
        }
      }

      setIsDropdownOpen(false);
      isSelecting.current = false;
    },
    [getAllCombinations, setSelectedAPI, setSelectedLLM]
  );

  // Validate selectedLLM
  useEffect(() => {
    const validLLMs = getLLMOptionsForAPI(selectedAPI).map((llm) => llm.value);
    if (!validLLMs.includes(selectedLLM)) {
      const defaultLLM = validLLMs[0] || "";
      if (defaultLLM) {
        console
          .log
          // `Invalid LLM ${selectedLLM} for ${selectedAPI}, setting to ${defaultLLM}`
          ();
        setSelectedLLM(defaultLLM);
      }
    }
  }, [selectedAPI, selectedLLM, getLLMOptionsForAPI, setSelectedLLM]);

  // Scroll to selected item
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current && selectedItemRef.current) {
      const dropdown = dropdownRef.current.querySelector(
        ".overflow-y-auto"
      ) as HTMLElement;
      const selectedItem = selectedItemRef.current;

      if (dropdown && selectedItem) {
        const itemOffsetTop = selectedItem.offsetTop;
        const itemHeight = selectedItem.offsetHeight;
        const dropdownHeight = dropdown.clientHeight;

        // Position the selected item near the top of the dropdown
        // Adjust this value to control how much padding you want above the selected item
        const padding = 10;

        // Set scrollTop to position the selected item at the top
        dropdown.scrollTop = itemOffsetTop - padding;

        // Optional: If you want to center the selected item instead, use:
        // dropdown.scrollTop = itemOffsetTop - (dropdownHeight / 2) + (itemHeight / 2);
      }
    }
  }, [isDropdownOpen]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // Get current display text
  const getCurrentDisplayText = useCallback(() => {
    const provider = apiOptions.find((api) => api.value === selectedAPI);
    const model = getLLMOptionsForAPI(selectedAPI).find(
      (llm) => llm.value === selectedLLM
    );
    return {
      provider: provider?.label || selectedAPI,
      model: model?.label || selectedLLM,
    };
  }, [selectedAPI, selectedLLM, apiOptions, getLLMOptionsForAPI]);

  const handleInputChange = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      setMessage(textarea.value);
      messageRef.current = textarea.value;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [textareaRef, messageRef]);

  const handleSubmit = useCallback(() => {
    if (!message.trim() && !selectedFile) return;
    handleSendMessage();
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
      messageRef.current = "";
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
    }
  }, [message, selectedFile, handleSendMessage, textareaRef, messageRef]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        (message.trim() || selectedFile)
      ) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [message, selectedFile, handleSubmit]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setSelectedFile(file);
    },
    [setSelectedFile]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
  }, [setSelectedFile]);

  const canSend = (message.trim() || selectedFile) && !loading;
  const allCombinations = getAllCombinations();
  const currentId = `${selectedAPI}:${selectedLLM}`;
  const { provider, model } = getCurrentDisplayText();

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
        <div
          className={`border rounded-xl rounded-bl-none rounded-br-none ${
            theme === "dark"
              ? "border-neutral-600 bg-neutral-800"
              : "border-neutral-400 bg-white"
          } focus-within:border-blue-500 transition-colors`}
        >
          <div className="relative">
            <textarea
              ref={textareaRef}
              onInput={handleInputChange}
              onKeyDown={handleKeyPress}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                onClick={handleSubmit}
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
          <div className="px-3 py-1 flex flex-wrap gap-3 items-center">
            <div className="relative w-auto min-w-[240px]" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => !loading && setIsDropdownOpen(!isDropdownOpen)}
                disabled={loading}
                className={`w-full flex items-center justify-between pl-4 pr-3 py-1.5 text-left rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm ${
                  theme === "dark"
                    ? "bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700"
                    : "bg-white border-neutral-300 text-neutral-900 hover:bg-neutral-50"
                } ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <span className="truncate">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {provider} -{" "}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {model}
                  </span>
                </span>
                <IoChevronDown
                  className={`w-4 h-4 text-neutral-400 transition-transform flex-shrink-0 ml-2 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div
                  className={`absolute bottom-full left-0 right-0 z-50 mb-1 rounded-md border shadow-lg max-h-80 overflow-y-auto transition-all duration-200 ease-out transform ${
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
                  {allCombinations.map((combination) => (
                    <div
                      key={combination.id}
                      ref={
                        currentId === combination.id ? selectedItemRef : null
                      }
                      onClick={() => handleCombinationSelection(combination.id)}
                      className={`px-4 py-3 cursor-pointer transition-colors ${
                        currentId === combination.id
                          ? theme === "dark"
                            ? "bg-neutral-700 text-white"
                            : "bg-blue-50 text-blue-900"
                          : theme === "dark"
                          ? "text-neutral-200 hover:bg-neutral-700"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                      data-id={combination.id}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`text-xs ${
                            theme === "dark"
                              ? "text-neutral-400"
                              : "text-neutral-500"
                          }`}
                        >
                          {combination.providerLabel}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-white" : "text-neutral-900"
                          }`}
                        >
                          {combination.modelLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
    </>
  );
};

export default MessageInput;
