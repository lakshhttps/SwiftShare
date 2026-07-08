import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

/**
 * Room page: shows the room code to share, and a drop zone for picking files.
 * Files just sit in local state for now — actually sending them over a
 * WebRTC data channel is built in Phase 6.
 */
export function Room({ roomCode, onLeaveRoom }) {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  function addFiles(fileList) {
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Room code</p>
        <p className="text-3xl font-bold tracking-widest text-brand-600">{roomCode}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Waiting for another device to join…
        </p>
      </Card>

      <Card className="w-full max-w-md">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? "border-brand-500 bg-brand-50 dark:bg-slate-700"
              : "border-slate-300 dark:border-slate-600"
          }`}
        >
          <p className="text-slate-600 dark:text-slate-300">Drag files here, or</p>
          <label className="inline-block mt-2">
            <span className="text-brand-600 font-medium cursor-pointer">browse</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </label>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {files.map((file, i) => (
              <li key={i} className="flex justify-between">
                <span className="truncate">{file.name}</span>
                <span className="text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Button variant="secondary" onClick={onLeaveRoom}>
        Leave Room
      </Button>
    </div>
  );
}
