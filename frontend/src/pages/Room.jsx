import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { socket } from "../utils/socket";
import { useWebRTC } from "../hooks/useWebRTC";
import { useFileTransfer } from "../hooks/useFileTransfer";

const STATUS_LABELS = {
  idle: "Waiting for another device to join…",
  new: "Connecting…",
  connecting: "Connecting…",
  connected: "Connected",
  "channel-open": "Connected",
  disconnected: "Disconnected",
  failed: "Connection failed",
  closed: "Disconnected",
};

export function Room({ roomCode, initialPeers, onLeaveRoom }) {
  const [files, setFiles] = useState([]);
  const [fileStatus, setFileStatus] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [peers, setPeers] = useState(initialPeers);

  const otherPeers = peers.filter((p) => p.socketId !== socket.id);
  const otherSocketId = otherPeers[0]?.socketId ?? null;

  const { connectionState, dataChannel } = useWebRTC(otherSocketId);
  const { receivedFiles, sendFile } = useFileTransfer(dataChannel);

  useEffect(() => {
    function handlePeerJoined(peer) {
      setPeers((prev) => [...prev, peer]);
    }

    function handlePeerLeft({ socketId }) {
      setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
    }

    socket.on("peer-joined", handlePeerJoined);
    socket.on("peer-left", handlePeerLeft);

    return () => {
      socket.off("peer-joined", handlePeerJoined);
      socket.off("peer-left", handlePeerLeft);
    };
  }, []);

  function addFiles(fileList) {
    setFiles((prev) => [...prev, ...Array.from(fileList)]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  async function handleSend(index, file) {
    setFileStatus((prev) => ({ ...prev, [index]: "sending" }));
    await sendFile(file);
    setFileStatus((prev) => ({ ...prev, [index]: "sent" }));
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  }

  const isChannelOpen = connectionState === "channel-open";
  const statusLabel = otherSocketId
    ? STATUS_LABELS[connectionState] ?? "Connecting…"
    : STATUS_LABELS.idle;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-16">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Room code</p>
        <p className="text-3xl font-bold tracking-widest text-brand-600">{roomCode}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {otherPeers.length > 0 ? `${otherPeers[0].deviceName} — ${statusLabel}` : statusLabel}
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
          <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {files.map((file, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  variant="secondary"
                  className="px-3 py-1 text-xs shrink-0"
                  disabled={!isChannelOpen || fileStatus[i] === "sending" || fileStatus[i] === "sent"}
                  onClick={() => handleSend(i, file)}
                >
                  {fileStatus[i] === "sent" ? "Sent" : fileStatus[i] === "sending" ? "Sending…" : "Send"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {receivedFiles.length > 0 && (
        <Card className="w-full max-w-md">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Received</h3>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {receivedFiles.map((file, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button
                  className="px-3 py-1 text-xs shrink-0"
                  onClick={() => downloadFile(file)}
                >
                  Download
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Button variant="secondary" onClick={onLeaveRoom}>
        Leave Room
      </Button>
    </div>
  );
}
