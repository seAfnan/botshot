import React, { useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoCopy, IoCheckmark } from "react-icons/io5";
import { Components } from "react-markdown";

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: ReactNode[];
} & React.HTMLAttributes<HTMLElement>;

interface MessageRendererProps {
  content: string;
  theme: "light" | "dark";
  streaming?: boolean;
}

interface CopiedStates {
  [key: string]: boolean;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
  content,
  theme,
  streaming,
}) => {
  const [copiedStates, setCopiedStates] = useState<CopiedStates>({});

  const copyToClipboard = async (text: string, id: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [id]: true }));

      // Clear any existing timeout for this id
      setTimeout(() => {
        setCopiedStates((prev) => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      }, 3000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Helper function to get language-specific colors and info
  const getLanguageInfo = (language: string) => {
    const langMap: {
      [key: string]: { color: string; bgColor: string; name: string };
    } = {
      javascript: {
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        name: "JavaScript",
      },
      js: {
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/20",
        name: "JavaScript",
      },
      typescript: {
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        name: "TypeScript",
      },
      ts: {
        color: "text-blue-400",
        bgColor: "bg-blue-500/20",
        name: "TypeScript",
      },
      tsx: { color: "text-cyan-400", bgColor: "bg-cyan-500/20", name: "TSX" },
      jsx: { color: "text-cyan-400", bgColor: "bg-cyan-500/20", name: "JSX" },
      html: {
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        name: "HTML",
      },
      css: { color: "text-blue-300", bgColor: "bg-blue-400/20", name: "CSS" },
      scss: { color: "text-pink-400", bgColor: "bg-pink-500/20", name: "SCSS" },
      sass: { color: "text-pink-400", bgColor: "bg-pink-500/20", name: "Sass" },
      python: {
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        name: "Python",
      },
      py: {
        color: "text-green-400",
        bgColor: "bg-green-500/20",
        name: "Python",
      },
      java: { color: "text-red-400", bgColor: "bg-red-500/20", name: "Java" },
      c: { color: "text-gray-400", bgColor: "bg-gray-500/20", name: "C" },
      cpp: {
        color: "text-purple-400",
        bgColor: "bg-purple-500/20",
        name: "C++",
      },
      go: { color: "text-cyan-300", bgColor: "bg-cyan-400/20", name: "Go" },
      rust: {
        color: "text-orange-500",
        bgColor: "bg-orange-600/20",
        name: "Rust",
      },
      php: {
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/20",
        name: "PHP",
      },
      ruby: { color: "text-red-500", bgColor: "bg-red-600/20", name: "Ruby" },
      swift: {
        color: "text-orange-400",
        bgColor: "bg-orange-500/20",
        name: "Swift",
      },
      kotlin: {
        color: "text-purple-500",
        bgColor: "bg-purple-600/20",
        name: "Kotlin",
      },
      dart: { color: "text-blue-500", bgColor: "bg-blue-600/20", name: "Dart" },
      sql: { color: "text-teal-400", bgColor: "bg-teal-500/20", name: "SQL" },
      json: {
        color: "text-yellow-300",
        bgColor: "bg-yellow-400/20",
        name: "JSON",
      },
      yaml: {
        color: "text-green-300",
        bgColor: "bg-green-400/20",
        name: "YAML",
      },
      yml: {
        color: "text-green-300",
        bgColor: "bg-green-400/20",
        name: "YAML",
      },
      xml: {
        color: "text-orange-300",
        bgColor: "bg-orange-400/20",
        name: "XML",
      },
      markdown: {
        color: "text-gray-300",
        bgColor: "bg-gray-400/20",
        name: "Markdown",
      },
      md: {
        color: "text-gray-300",
        bgColor: "bg-gray-400/20",
        name: "Markdown",
      },
      bash: {
        color: "text-green-500",
        bgColor: "bg-green-600/20",
        name: "Bash",
      },
      sh: {
        color: "text-green-500",
        bgColor: "bg-green-600/20",
        name: "Shell",
      },
      powershell: {
        color: "text-blue-500",
        bgColor: "bg-blue-600/20",
        name: "PowerShell",
      },
      dockerfile: {
        color: "text-blue-600",
        bgColor: "bg-blue-700/20",
        name: "Dockerfile",
      },
    };

    return (
      langMap[language.toLowerCase()] || {
        color: "text-gray-400",
        bgColor: "bg-gray-500/20",
        name: language.toUpperCase(),
      }
    );
  };

  // Helper function to extract filename from code content
  const extractFilename = (codeString: string): string | null => {
    const lines = codeString.trim().split("\n");
    const firstLine = lines[0]?.trim();

    // Check if first line looks like a filename (common patterns)
    if (
      firstLine &&
      (/^[\w.-]+\.[a-zA-Z0-9]+$/.test(firstLine) ||
        (firstLine.startsWith("// ") &&
          /[\w.-]+\.[a-zA-Z0-9]+/.test(firstLine)) ||
        (firstLine.startsWith("# ") &&
          /[\w.-]+\.[a-zA-Z0-9]+/.test(firstLine)) ||
        (firstLine.startsWith("<!-- ") &&
          /[\w.-]+\.[a-zA-Z0-9]+/.test(firstLine)))
    ) {
      // Extract filename from comment or direct filename
      const match = firstLine.match(/[\w.-]+\.[a-zA-Z0-9]+/);
      return match ? match[0] : null;
    }

    return null;
  };

  // Helper function to determine if content should be treated as a code block
  const isActualCodeBlock = (
    codeString: string,
    language?: string
  ): boolean => {
    const trimmedCode = codeString.trim();

    // If it's too short, likely not a code block
    if (trimmedCode.length < 10) return false;

    // If it doesn't contain multiple lines or typical code patterns, likely not code
    const hasMultipleLines = trimmedCode.includes("\n");
    const hasCodePatterns = /[{}();=<>]/.test(trimmedCode);
    const hasSpaces = trimmedCode.includes(" ");

    // Simple heuristic: if it's just a filename or short text, don't treat as code block
    const looksLikeFilename = /^[\w.-]+\.[a-zA-Z0-9]+$/.test(trimmedCode);
    const looksLikeShortText =
      !hasMultipleLines && trimmedCode.split(" ").length < 5;

    if (looksLikeFilename || (looksLikeShortText && !hasCodePatterns)) {
      return false;
    }

    return hasMultipleLines || hasCodePatterns || trimmedCode.length > 50;
  };

  const components: Components = {
    // Enhanced code blocks
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const codeIdRef = React.useRef(
        `code-${Math.random().toString(36).substr(2, 9)}`
      );
      const codeStr = React.Children.toArray(children).join("");
      const codeId = React.useMemo(() => {
        return `code-${btoa(codeStr).slice(0, 10)}`;
      }, [codeStr]);

      // Convert children to string properly
      const childrenArray = React.Children.toArray(children);
      const codeString = childrenArray.join("");

      // Check if it's a code block (not inline) and actually contains code-like content
      if (!inline && match) {
        const language = match[1];
        const cleanCodeString = String(children).trim();
        const languageInfo = getLanguageInfo(language);
        const filename = extractFilename(cleanCodeString);

        // Use our helper function to determine if this should be treated as a code block
        if (!isActualCodeBlock(cleanCodeString, language)) {
          // Treat as inline code instead
          return (
            <code
              className={`px-2 py-1 rounded-md text-sm lg:font-light lg:text-base font-mono ${
                theme === "dark"
                  ? "bg-neutral-800 text-red-300 border border-neutral-700"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <div className="relative group my-6 rounded-lg overflow-hidden border shadow-sm">
            {/* Header with language/filename and copy button */}
            <div
              className={`flex items-center justify-between px-4 py-0.5 text-sm lg:font-light lg:text-base font-medium ${
                theme === "dark"
                  ? `${languageInfo.bgColor} border-b border-neutral-700`
                  : `${languageInfo.bgColor} border-b border-neutral-200`
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`${languageInfo.color} font-semibold`}>
                  {filename || languageInfo.name}
                </span>
                {filename && (
                  <span
                    className={`text-xs lg:text-sm opacity-70 ${languageInfo.color}`}
                  >
                    {languageInfo.name}
                  </span>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(codeStr, codeId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
                  theme === "dark"
                    ? "hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-neutral-600"
                    : "hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 border border-transparent hover:border-neutral-300"
                } ${copiedStates[codeId] ? "scale-95" : "hover:scale-105"}`}
                type="button"
              >
                {copiedStates[codeId] ? (
                  <>
                    <IoCheckmark size={14} className="text-green-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <IoCopy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code block with distinct background */}
            <div className="relative">
              <div className="text-sm lg:font-light lg:text-base">
                <SyntaxHighlighter
                  style={theme === "dark" ? vscDarkPlus : vs}
                  language={language}
                  PreTag="div"
                  className="!mt-0 !rounded-none !text-sm lg:!font-light lg:!text-base"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    lineHeight: "1.6",
                    padding: "1.25rem",
                    backgroundColor: theme === "dark" ? "#1e1e1e" : "#f8f9fa",
                  }}
                  showLineNumbers={cleanCodeString.split("\n").length > 5}
                  wrapLines={true}
                  {...props}
                >
                  {cleanCodeString}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        );
      }

      // Handle code blocks without language specification
      if (!inline) {
        const cleanCodeString = codeString.replace(/\n$/, "");
        const filename = extractFilename(cleanCodeString);

        // Check if this should be treated as a code block
        if (!isActualCodeBlock(cleanCodeString)) {
          // Treat as inline code instead
          return (
            <code
              className={`px-2 py-1 rounded-md text-sm lg:font-light lg:text-base font-mono ${
                theme === "dark"
                  ? "bg-neutral-800 text-red-300 border border-neutral-700"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
              {...props}
            >
              {children}
            </code>
          );
        }

        return (
          <div
            className={`relative group my-6 rounded-lg overflow-hidden shadow-sm border ${
              theme === "dark" ? "border-neutral-500" : "border-neutral-500"
            }`}
          >
            <div
              className={`flex items-center justify-between px-4 py-0.5 text-sm lg:font-light lg:text-base font-medium ${
                theme === "dark"
                  ? "bg-gradient-to-r from-neutral-800 to-neutral-700 text-neutral-300 border-b border-neutral-600"
                  : "bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-600 border-b border-neutral-200"
              }`}
            >
              <span
                className={`font-semibold ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {filename || "CODE"}
              </span>
              <button
                onClick={() => copyToClipboard(cleanCodeString, codeId)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
                  theme === "dark"
                    ? "hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 border border-transparent hover:border-neutral-600"
                    : "hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 border border-transparent hover:border-neutral-300"
                } ${copiedStates[codeId] ? "scale-95" : "hover:scale-105"}`}
                type="button"
              >
                {copiedStates[codeId] ? (
                  <>
                    <IoCheckmark size={14} className="text-green-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <IoCopy size={14} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div
              className={`p-5 font-mono text-sm lg:font-light lg:text-base overflow-x-auto ${
                theme === "dark"
                  ? "bg-neutral-900/70 text-neutral-300 border-t border-neutral-700"
                  : "bg-gray-50 text-neutral-700 border-t border-neutral-200"
              }`}
            >
              <pre className="whitespace-pre-wrap">
                <code>{cleanCodeString}</code>
              </pre>
            </div>
          </div>
        );
      }

      // Inline code with better contrast
      return (
        <code
          className={`px-2 py-1 rounded-md text-sm lg:font-light lg:text-base font-mono ${
            theme === "dark"
              ? "bg-neutral-800 text-red-300 border border-neutral-700"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
          {...props}
        >
          {children}
        </code>
      );
    },

    // Enhanced headings
    h1: ({ children }) => (
      <h1
        className={`text-lg lg:text-xl font-bold mb-4 pb-2 border-b ${
          theme === "dark"
            ? "text-neutral-100 border-neutral-600"
            : "text-neutral-900 border-neutral-300"
        }`}
      >
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <h2
        className={`text-base lg:text-lg font-semibold mb-3 mt-6 ${
          theme === "dark" ? "text-neutral-200" : "text-neutral-800"
        }`}
      >
        {children}
      </h2>
    ),

    h3: ({ children }) => (
      <h3
        className={`text-sm lg:text-base font-medium mb-2 mt-4 ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-700"
        }`}
      >
        {children}
      </h3>
    ),

    // Enhanced lists
    ul: ({ children }) => (
      <ul
        className={`list-disc pl-6 mb-4 space-y-1 text-sm lg:font-light lg:text-base ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-700"
        }`}
      >
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol
        className={`list-decimal pl-6 mb-4 space-y-1 text-sm lg:font-light lg:text-base ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-700"
        }`}
      >
        {children}
      </ol>
    ),

    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    // Enhanced blockquotes
    blockquote: ({ children }) => (
      <blockquote
        className={`border-l-4 pl-4 py-2 my-4 italic text-sm lg:font-light lg:text-base ${
          theme === "dark"
            ? "border-blue-400 bg-neutral-800 text-neutral-300"
            : "border-blue-500 bg-blue-50 text-neutral-600"
        }`}
      >
        {children}
      </blockquote>
    ),

    // Enhanced tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table
          className={`min-w-full border-collapse border text-sm lg:font-light lg:text-base ${
            theme === "dark" ? "border-neutral-600" : "border-neutral-300"
          }`}
        >
          {children}
        </table>
      </div>
    ),

    th: ({ children }) => (
      <th
        className={`border px-4 py-2 text-left font-semibold text-sm lg:font-light lg:text-base ${
          theme === "dark"
            ? "border-neutral-600 bg-neutral-700 text-neutral-200"
            : "border-neutral-300 bg-neutral-100 text-neutral-800"
        }`}
      >
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td
        className={`border px-4 py-2 text-sm lg:font-light lg:text-base ${
          theme === "dark"
            ? "border-neutral-600 text-neutral-300"
            : "border-neutral-300 text-neutral-700"
        }`}
      >
        {children}
      </td>
    ),

    // Enhanced paragraphs
    p: ({ children }) => (
      <p
        className={`mb-3 leading-relaxed text-sm lg:font-light lg:text-base ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-700"
        }`}
      >
        {children}
      </p>
    ),

    // Enhanced links
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline font-medium transition-colors text-sm lg:font-light lg:text-base ${
          theme === "dark"
            ? "text-blue-400 hover:text-blue-300"
            : "text-blue-600 hover:text-blue-800"
        }`}
      >
        {children}
      </a>
    ),

    // Enhanced horizontal rules
    hr: () => (
      <hr
        className={`my-6 border-t ${
          theme === "dark" ? "border-neutral-600" : "border-neutral-300"
        }`}
      />
    ),
  };

  return (
    <div className="prose dark:prose-invert max-w-none bg-transparent">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>

      {/* Streaming indicator */}
      {streaming && (
        <div className="flex items-center gap-1 mt-2">
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
      )}
    </div>
  );
};

export default MessageRenderer;
