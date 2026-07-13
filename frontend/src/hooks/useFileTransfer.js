import { useEffect, useRef, useState } from "react";

const CHUNK_SIZE = 16384;
const BUFFER_LIMIT = CHUNK_SIZE * 8;
const PROGRESS_INTERVAL_MS = 150;

export function useFileTransfer(dataChannel) {
  const [receivedFiles, setReceivedFiles] = useState([]);
  const [incomingProgress, setIncomingProgress] = useState(null);
  const incomingRef = useRef(null);
  const lastIncomingUpdateRef = useRef(0);

  useEffect(() => {
    if (!dataChannel) return;

    function handleMessage(e) {
      try {
        if (typeof e.data === "string") {
          const message = JSON.parse(e.data);

          if (message.type === "file-meta") {
            incomingRef.current = {
              name: message.name,
              size: message.size,
              chunks: [],
              receivedBytes: 0,
              startTime: Date.now(),
            };
            lastIncomingUpdateRef.current = 0;
            setIncomingProgress({ name: message.name, size: message.size, receivedBytes: 0, speed: 0 });
          }

          if (message.type === "file-end" && incomingRef.current) {
            const { name, size, chunks } = incomingRef.current;
            const blob = new Blob(chunks);
            incomingRef.current = null;
            setReceivedFiles((prev) => [...prev, { name, size, blob }]);
            setIncomingProgress(null);
          }
        } else if (incomingRef.current) {
          incomingRef.current.chunks.push(e.data);
          incomingRef.current.receivedBytes += e.data.byteLength;

          const now = Date.now();
          const isDone = incomingRef.current.receivedBytes >= incomingRef.current.size;

          if (now - lastIncomingUpdateRef.current > PROGRESS_INTERVAL_MS || isDone) {
            lastIncomingUpdateRef.current = now;
            const elapsed = (now - incomingRef.current.startTime) / 1000;
            const speed = elapsed > 0 ? incomingRef.current.receivedBytes / elapsed : 0;
            setIncomingProgress({
              name: incomingRef.current.name,
              size: incomingRef.current.size,
              receivedBytes: incomingRef.current.receivedBytes,
              speed,
            });
          }
        }
      } catch {
        incomingRef.current = null;
        setIncomingProgress(null);
      }
    }

    dataChannel.addEventListener("message", handleMessage);
    return () => dataChannel.removeEventListener("message", handleMessage);
  }, [dataChannel]);

  async function sendFile(file, onProgress) {
    if (!dataChannel || dataChannel.readyState !== "open") return;

    dataChannel.send(JSON.stringify({ type: "file-meta", name: file.name, size: file.size }));

    const startTime = Date.now();
    let offset = 0;
    let lastUpdate = 0;

    while (offset < file.size) {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      const buffer = await slice.arrayBuffer();

      while (dataChannel.bufferedAmount > BUFFER_LIMIT) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      dataChannel.send(buffer);
      offset += buffer.byteLength;

      const now = Date.now();
      const isDone = offset >= file.size;

      if (onProgress && (now - lastUpdate > PROGRESS_INTERVAL_MS || isDone)) {
        lastUpdate = now;
        const elapsed = (now - startTime) / 1000;
        const speed = elapsed > 0 ? offset / elapsed : 0;
        onProgress(offset, file.size, speed);
      }
    }

    dataChannel.send(JSON.stringify({ type: "file-end" }));
  }

  return { receivedFiles, sendFile, incomingProgress };
}
