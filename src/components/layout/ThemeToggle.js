"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center
        w-14 h-7 rounded-full
        transition-colors duration-300
        ${isDark ? "bg-slate-800" : "bg-slate-200"}
      `}
      aria-label="Toggle Theme"
    >
      {/* Sliding circle */}
      <div
        className={`
          absolute flex items-center justify-center
          w-6 h-6 bg-white rounded-full shadow-md
          transform transition-transform duration-300
          ${isDark ? "translate-x-7" : "translate-x-1"}
        `}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-slate-800" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </div>
    </button>
  );
}
