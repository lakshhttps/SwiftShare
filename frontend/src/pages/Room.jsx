import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { socket } from "../utils/socket";
import { useWebRTC } from "../hooks/useWebRTC";
import { useFileTransfer } from "../hooks/useFileTransfer";
import { formatBytes, formatSpeed } from "../utils/format";

const STATUS_LABELS = {
  idle: "Waiting for another device to join…",
  new: "Connecting…",
  connecting: "Connecting…",
  connected: "Connected",
  "channel-open": "Connected",
  disconnected: "Disconnected",
  failed: "Connection lost. Retrying…",
  closed: "Disconnected",
};

const MAX_FILE_SIZE = 200 * 1024 * 1024;

export function Room({ roomCode, initialPeers, onLeaveRoom }) {
  const [files, setFiles] = useState([]);
  const [fileStatus, setFileStatus] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [peers, setPeers] = useState(initialPeers);
  const [isSending, setIsSending] = useState(false);
  const [sizeWarning, setSizeWarning] = useState("");

  const otherPeers = peers.filter((p) => p.socketId !== socket.id);
  const otherSocketId = otherPeers[0]?.socketId ?? null;

  const { connectionState, dataChannel } = useWebRTC(otherSocketId);
  const { receivedFiles, sendFile, incomingProgress } = useFileTransfer(dataChannel);

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
    const incoming = Array.from(fileList);
    const tooLarge = incoming.filter((f) => f.size > MAX_FILE_SIZE);
    const okFiles = incoming.filter((f) => f.size <= MAX_FILE_SIZE);

    if (tooLarge.length > 0) {
      setSizeWarning(`${tooLarge.map((f) => f.name).join(", ")} skipped — over the 200MB limit.`);
    } else {
      setSizeWarning("");
    }

    setFiles((prev) => [...prev, ...okFiles]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  async function handleSend(index, file) {
    setIsSending(true);
    setFileStatus((prev) => ({ ...prev, [index]: { state: "sending", sentBytes: 0, speed: 0 } }));

    await sendFile(file, (sentBytes, totalBytes, speed) => {
      setFileStatus((prev) => ({ ...prev, [index]: { state: "sending", sentBytes, speed } }));
    });

    setFileStatus((prev) => ({ ...prev, [index]: { state: "sent", sentBytes: file.size, speed: 0 } }));
    setIsSending(false);
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const isChannelOpen = connectionState === "channel-open";
  const statusLabel = otherSocketId
    ? STATUS_LABELS[connectionState] ?? "Connecting…"
    : STATUS_LABELS.idle;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-16">
      <Card className="w-full max-w-md text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Room code</p>
        <p className={`text-3xl font-bold tracking-widest text-brand-600 ${otherPeers.length === 0 ? "animate-pulse" : ""}`}>
          {roomCode}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {otherPeers.length > 0 ? `${otherPeers[0].deviceName} — ${statusLabel}` : statusLabel}
        </p>
      </Card>

      {otherPeers.length === 0 && (
        <Card className="w-full max-w-md flex flex-col items-center gap-3">
          <QRCodeSVG
            value={`${window.location.origin}${window.location.pathname}?room=${roomCode}`}
            size={160}
          />
          <p className="text-xs text-slate-400">Scan to join from another device</p>
        </Card>
      )}

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

        {sizeWarning && <p className="mt-2 text-xs text-red-500">{sizeWarning}</p>}

        {files.length > 0 && (
          <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
            {files.map((file, i) => {
              const status = fileStatus[i];
              const progress = status ? (status.sentBytes / file.size) * 100 : 0;

              return (
                <li key={i}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">
                        {status?.state === "sending"
                          ? `${formatBytes(status.sentBytes)} / ${formatBytes(file.size)} — ${formatSpeed(status.speed)}`
                          : formatBytes(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs shrink-0"
                      disabled={!isChannelOpen || isSending || status?.state === "sent"}
                      onClick={() => handleSend(i, file)}
                    >
                      {status?.state === "sent" ? "Sent" : status?.state === "sending" ? "Sending…" : "Send"}
                    </Button>
                  </div>
                  {status?.state === "sending" && (
                    <div className="mt-1.5">
                      <ProgressBar progress={progress} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {incomingProgress && (
        <Card className="w-full max-w-md">
          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">
            Receiving {incomingProgress.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {formatBytes(incomingProgress.receivedBytes)} / {formatBytes(incomingProgress.size)} —{" "}
            {formatSpeed(incomingProgress.speed)}
          </p>
          <div className="mt-2">
            <ProgressBar progress={(incomingProgress.receivedBytes / incomingProgress.size) * 100} />
          </div>
        </Card>
      )}

      {receivedFiles.length > 0 && (
        <Card className="w-full max-w-md">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Received</h3>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {receivedFiles.map((file, i) => (
              <li key={i} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
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
