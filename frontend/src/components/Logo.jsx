export function Logo({ iconClassName = "h-8", textClassName = "text-xl" }) {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo-icon.png" alt="" className={iconClassName} />
      <span className={`font-bold text-slate-900 dark:text-white ${textClassName}`}>
        SwiftShare
      </span>
    </div>
  );
}
