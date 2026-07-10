import { useEffect, useRef, useState } from "react";

const CHUNK_SIZE = 16384;
const BUFFER_LIMIT = CHUNK_SIZE * 8;

export function useFileTransfer(dataChannel) {
  const [receivedFiles, setReceivedFiles] = useState([]);
  const incomingRef = useRef(null);

  useEffect(() => {
    if (!dataChannel) return;

    function handleMessage(e) {
      if (typeof e.data === "string") {
        const message = JSON.parse(e.data);

        if (message.type === "file-meta") {
          incomingRef.current = { name: message.name, size: message.size, chunks: [] };
        }

        if (message.type === "file-end" && incomingRef.current) {
          const blob = new Blob(incomingRef.current.chunks);
          setReceivedFiles((prev) => [
            ...prev,
            { name: incomingRef.current.name, size: incomingRef.current.size, blob },
          ]);
          incomingRef.current = null;
        }
      } else if (incomingRef.current) {
        incomingRef.current.chunks.push(e.data);
      }
    }

    dataChannel.addEventListener("message", handleMessage);
    return () => dataChannel.removeEventListener("message", handleMessage);
  }, [dataChannel]);

  async function sendFile(file) {
    if (!dataChannel || dataChannel.readyState !== "open") return;

    dataChannel.send(JSON.stringify({ type: "file-meta", name: file.name, size: file.size }));

    let offset = 0;
    while (offset < file.size) {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      const buffer = await slice.arrayBuffer();

      while (dataChannel.bufferedAmount > BUFFER_LIMIT) {
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      dataChannel.send(buffer);
      offset += buffer.byteLength;
    }

    dataChannel.send(JSON.stringify({ type: "file-end" }));
  }

  return { receivedFiles, sendFile };
}
