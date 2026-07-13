export function Card({ children, className = "", style }) {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
