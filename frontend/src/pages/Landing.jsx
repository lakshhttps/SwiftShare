import { Button } from "../components/Button";

const FEATURES = [
  "No uploads, no waiting on server bandwidth",
  "No account, no size limits, no tracking",
  "Works across desktop and mobile browsers",
];

export function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-4xl w-full">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            SwiftShare
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            Files go straight from your device to theirs. Nothing passes through us.
          </p>
          <ul className="mt-6 space-y-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="text-brand-600 mt-0.5">•</span>
                {f}
              </li>
            ))}
          </ul>
          <Button onClick={onGetStarted} className="mt-8 text-base px-6 py-3">
            Get Started
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl">
            💻
          </div>
          <svg width="80" height="24" viewBox="0 0 80 24" className="text-brand-600">
            <line
              x1="2" y1="12" x2="78" y2="12"
              stroke="currentColor" strokeWidth="2" strokeDasharray="6 6"
            >
              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite" />
            </line>
          </svg>
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl">
            📱
          </div>
        </div>
      </div>
    </div>
  );
}
