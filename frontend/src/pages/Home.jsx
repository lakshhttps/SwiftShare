import { useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { socket } from "../utils/socket";
import { getDeviceName } from "../utils/deviceName";
import { saveActiveRoom } from "../utils/activeRoom";

export function Home({ onEnterRoom }) {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  function handleCreateRoom() {
    const deviceName = getDeviceName();
    socket.emit("create-room", { deviceName }, (response) => {
      saveActiveRoom(response.roomCode, deviceName);
      onEnterRoom(response.roomCode, response.peers);
    });
  }

  function handleJoinRoom(e) {
    e.preventDefault();
    if (joinCode.trim().length !== 6) return;

    const deviceName = getDeviceName();
    socket.emit(
      "join-room",
      { roomCode: joinCode.trim(), deviceName },
      (response) => {
        if (response.error) {
          setError(response.error);
          return;
        }
        saveActiveRoom(response.roomCode, deviceName);
        onEnterRoom(response.roomCode, response.peers);
      }
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">SwiftShare</h1>
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
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </Card>
    </div>
  );
}
