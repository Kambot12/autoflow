"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme =
      (window.localStorage.getItem("autoflow-theme") as Theme | null) || "light";
    setTheme(savedTheme);
    document.documentElement.dataset.theme = savedTheme;
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const nextTheme = current === "light" ? "dark" : "light";
      window.localStorage.setItem("autoflow-theme", nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      return nextTheme;
    });
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
