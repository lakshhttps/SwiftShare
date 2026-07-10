export function Footer() {
  return (
    <footer className="absolute bottom-0 inset-x-0 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
      © {new Date().getFullYear()} SwiftShare. All rights reserved.
    </footer>
  );
}
