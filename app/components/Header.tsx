"use client";
import React, { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../Providers/ThemeContext";
import { signIn, signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LuLogOut } from "react-icons/lu";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

const Header = () => {
  const context = useContext(ThemeContext);
  const { switchDark, switchLight, theme } = context ?? {};
  const { status, data: session } = useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`flex items-center justify-between px-6 py-2 shadow-md transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Left: Brand */}
      <div className="text-2xl font-bold tracking-tight">Botshot</div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4 relative">
        {status === "authenticated" && user ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="focus:outline-none cursor-pointer"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name ?? "User"}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold uppercase text-white">
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
                      ? "bg-gray-800 text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {/* User Info */}
                  <div className="mb-2">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>

                  {/* Theme Toggle */}
                  <button
                    onClick={theme === "dark" ? switchLight : switchDark}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded text-sm font-medium transition mb-2  ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    {theme === "dark" ? (
                      <MdSunny className="text-amber-200" />
                    ) : (
                      <FaMoon className="text-gray-800" />
                    )}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded text-sm font-medium transition ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
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
            className="bg-gray-200 text-gray-900 px-4 py-1.5 rounded hover:bg-gray-300 transition text-sm font-medium cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
