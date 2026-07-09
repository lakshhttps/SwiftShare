export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
