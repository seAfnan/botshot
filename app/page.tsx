import Image from "next/image";
import { Metadata } from "next";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <div className="p-10 bg-red-500 text-white text-3xl font-bold">
        Tailwind Works!
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "Botshot",
  description: "Chatbot clone",
};
