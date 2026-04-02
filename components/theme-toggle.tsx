"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-[100] inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/90 px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon className="w-4 h-4" /> : <SunMedium className="w-4 h-4" />}
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}
