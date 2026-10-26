"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lunabloom_theme") as Theme | null;
      if (stored === "dark" || stored === "light") {
        setThemeState(stored);
        document.documentElement.classList.toggle("dark", stored === "dark");
        document.documentElement.setAttribute("data-theme", stored);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setThemeState("dark");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("lunabloom_theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={mounted ? "" : "invisible"}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
