"use client";
import React, { RefObject } from "react";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LuLogOut } from "react-icons/lu";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import Link from "next/link";

interface HeaderProps {
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
  theme?: string;
  switchDark?: () => void;
  switchLight?: () => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement | null>; // Updated type to allow null
}

const Header: React.FC<HeaderProps> = ({
  session,
  status,
  theme,
  switchDark,
  switchLight,
  dropdownOpen,
  setDropdownOpen,
  dropdownRef,
}) => {
  const user = session?.user;

  return (
    <header
      className={`w-full flex items-center justify-between px-6 py-2 pb-0 shadow-md transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-950/70 via-gray-950/50 to-gray-900/10"
          : "bg-neutral-200 text-neutral-900"
      }`}
      style={{
        borderBottom: theme === "dark" ? "0.5px solid #424242" : "",
      }}
    >
      <Link href="/">
        <div
          className={`cursor-pointer text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${
            theme === "dark"
              ? "from-pink-400 via-purple-400 to-blue-400"
              : "from-blue-600 via-purple-600 to-pink-600"
          }`}
          style={{ marginTop: "-0.8rem" }}
        >
          Botshot
        </div>
      </Link>

      <div className="flex items-center gap-4 relative">
        {status === "authenticated" && user ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="focus:outline-none cursor-pointer"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User"}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-neutral-700 rounded-full flex items-center justify-center text-sm font-semibold uppercase text-white">
                  {user.name?.[0] ?? "?"}
                </div>
              )}
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-50 p-4 ${
                    theme === "dark"
                      ? "bg-neutral-800 text-white"
                      : "bg-white text-neutral-900"
                  }`}
                >
                  <div className="mb-2">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-neutral-400">{user.email}</p>
                  </div>
                  <button
                    onClick={theme === "dark" ? switchLight : switchDark}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded text-sm font-medium transition mb-2  ${
                      theme === "dark"
                        ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                        : "bg-neutral-200 hover:bg-neutral-300 text-neutral-900"
                    }`}
                  >
                    {theme === "dark" ? (
                      <MdSunny className="text-amber-200" />
                    ) : (
                      <FaMoon className="text-neutral-800" />
                    )}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded text-sm font-medium transition ${
                      theme === "dark"
                        ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                        : "bg-neutral-200 hover:bg-neutral-300 text-neutral-900"
                    }`}
                  >
                    <LuLogOut />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="bg-neutral-200 text-neutral-900 px-4 mb-2 py-1.5 rounded hover:bg-neutral-300 transition text-sm font-medium cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
