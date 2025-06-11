"use client";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ThemeContextType = "light" | "dark";

interface ContextProps {
  theme: ThemeContextType;
  switchDark: () => void;
  switchLight: () => void;
}

export const ThemeContext = createContext<ContextProps | undefined>(undefined);

const DarkModeContext = ({ children }: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<ThemeContextType>("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeContextType | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const switchDark = () => {
    setTheme("dark");
    localStorage.setItem("theme", "dark");
  };
  const switchLight = () => {
    setTheme("light");
    localStorage.setItem("theme", "light");
  };

  const contextValue: ContextProps = {
    theme,
    switchDark,
    switchLight,
  };

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`${theme} anim`}>{children}</div>
    </ThemeContext.Provider>
  );
};

export default DarkModeContext;
