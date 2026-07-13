import { useDarkMode } from "../hooks/useDarkMode";

export function ThemeToggle() {
  const [isDark, toggle] = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-lg transition-transform duration-300 hover:rotate-12 hover:scale-110"
      aria-label="Toggle dark mode"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
