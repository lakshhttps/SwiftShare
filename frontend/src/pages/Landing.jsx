import { Button } from "../components/Button";
import { Logo } from "../components/Logo";

const FEATURES = [
  "No uploads, no waiting on server bandwidth",
  "No account, no size limits, no tracking",
  "Works across desktop and mobile browsers",
];

const STEPS = [
  { number: "1", title: "Create or join", desc: "Start a room and get a 6-digit code, or enter one from another device." },
  { number: "2", title: "Connect directly", desc: "Both devices link up over a peer-to-peer connection, no middleman." },
  { number: "3", title: "Send files", desc: "Drag and drop, and files stream straight across, instantly." },
];

export function Landing({ onGetStarted }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16 gap-24">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-4xl w-full mt-10">
        <div className="animate-fade-in-up">
          <Logo iconClassName="h-14" textClassName="text-4xl" />
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

        <div
          className="flex items-center justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "150ms" }}
        >
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

      <div className="max-w-4xl w-full">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-8">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${200 + i * 120}ms` }}
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold">
                {step.number}
              </div>
              <h3 className="mt-3 font-semibold text-slate-800 dark:text-white">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
