import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

/**
 * Home page: pick to create a new room or join an existing one by code.
 * `onEnterRoom` is called with the room code once the user is "in" —
 * actual socket logic for create/join gets wired up in Phase 3.
 */
export function Home({ onEnterRoom }) {
  const [joinCode, setJoinCode] = useState("");

  function handleCreateRoom() {
    // Placeholder code — Phase 3 replaces this with a real server-generated code.
    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    onEnterRoom(tempCode);
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    if (joinCode.trim().length === 6) {
      onEnterRoom(joinCode.trim());
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">ShareIt</h1>
      <p className="text-slate-500 dark:text-slate-400 -mt-4">Send files, peer to peer.</p>

      <Card className="w-full max-w-sm text-center">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Create a room</h2>
        <Button onClick={handleCreateRoom} className="w-full">
          Create Room
        </Button>
      </Card>

      <Card className="w-full max-w-sm">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-3 text-center">Join a room</h2>
        <form onSubmit={handleJoinRoom} className="flex gap-2">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent text-slate-900 dark:text-white"
          />
          <Button type="submit" variant="secondary">
            Join
          </Button>
        </form>
      </Card>
    </div>
  );
}
