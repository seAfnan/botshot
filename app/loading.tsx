"use client";
import React, { useContext } from "react";
import { ThemeContext } from "./Providers/ThemeContext";

const Loading = () => {
  const context = useContext(ThemeContext);
  const { theme } = context ?? {};
  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        theme === "dark"
          ? "bg-gradient-to-b from-black via-[#121212] to-gray-900 text-white"
          : "bg-gradient-to-b from-indigo-100 via-indigo-100 to-indigo-100 text-black"
      }`}
    >
      Loading...
    </div>
  );
};

export default Loading;
