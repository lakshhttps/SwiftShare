import { socket } from "./socket";

export function sendSignal(targetSocketId, data) {
  socket.emit("signal", { targetSocketId, data });
}

export function onSignal(callback) {
  socket.on("signal", callback);
  return () => socket.off("signal", callback);
}
