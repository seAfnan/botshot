"use client";
import React, { useContext } from "react";
import { MdBrightness4, MdBrightness7 } from "react-icons/md";
import { ThemeContext } from "../Providers/ThemeContext";

type User = {
  name?: string;
  avatarUrl?: string;
};

type HeaderProps = {
  user: User | null;
};

const Header: React.FC<HeaderProps> = ({ user }) => {
  const context = useContext(ThemeContext);
  const { switchDark, switchLight, theme } = context ?? {};

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-md">
      {/* Left: Brand */}
      <div className="text-2xl font-bold tracking-tight">Botshot</div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={theme === "dark" ? switchLight : switchDark}
          className="text-2xl hover:text-gray-400 transition"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <MdBrightness7 /> : <MdBrightness4 />}
        </button>

        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-2">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User"}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold uppercase">
                {user.name?.[0] ?? "?"}
              </div>
            )}
            <span className="hidden sm:inline text-sm font-medium">
              {user.name}
            </span>
          </div>
        ) : (
          <button className="bg-white text-gray-900 px-4 py-1.5 rounded hover:bg-gray-100 transition text-sm font-medium">
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
