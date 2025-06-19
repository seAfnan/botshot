# 🧠 Botshot – Multi-LLM AI Assistant

Botshot is a flexible and intelligent AI chat interface that allows users to interact with **multiple LLMs** in a single conversation. Inspired by platforms like [t3.chat](https://t3.gg/chat), it provides a clean UI, model transparency, and developer-focused features for exploring AI systems more deeply.

## ✨ Features

- 🔁 **Per-Message Model Switching**: Select a different LLM (OpenAI, Anthropic, Groq, HuggingFace, or Local like LLaMA) for each individual message.
- 🧠 **Model Attribution**: Every response clearly displays which model generated it.
- ✍️ **Streamed Responses**: Real-time, typewriter-style rendering for natural conversation flow.
- 🎨 **Beautiful Markdown Rendering**: Supports syntax-highlighted code blocks, bullet points, lists, and rich formatting.
- 🌙 **Light/Dark Mode**: Toggle between light and dark themes for comfort and clarity.
- 🔐 **Google OAuth Login**: Secure, modern authentication experience.
- 📱 **Responsive Design**: Optimized for both desktop and mobile usage.

## 🧱 Tech Stack

- **Next.js (App Router)** – Modern React framework with server components.
- **TypeScript** – Strong typing across the entire stack.
- **Tailwind CSS** – Utility-first CSS for fast, responsive UI.
- **Prisma + MongoDB** – Type-safe database access.
- **React Icons** – Clean, consistent iconography.

## 🚀 Upcoming Features

- 📄 Upload and analyze documents (PDF, TXT).
- 🧩 Plugin architecture for RAG, memory, and custom tools.
- 🔌 Local LLM support for fully offline usage.
- 🔍 Natural language Q&A over uploaded content.

## 💻 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/seAfnan/botshot.git
cd botshot
```

### 2. Install dependencies
```bash
npm install
# or
yarn
```

### 3. Set up environment variables
Create a .env.local file and include the following:
```bash
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

DATABASE_URL=""

# Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

NODE_ENV="development"

HUGGINGFACE_API_KEY=""
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GROQ_API_KEY=""
```

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Visit http://localhost:3000 in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

## License

This project is licensed under the MIT License.


