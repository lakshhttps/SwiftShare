import { roomManager } from "../utils/roomManager.js";

export function registerRoomHandlers(io, socket) {
  socket.on("create-room", ({ deviceName }, callback) => {
    const roomCode = roomManager.generateRoomCode();
    roomManager.createRoom(roomCode);
    roomManager.addPeer(roomCode, {
      socketId: socket.id,
      deviceName,
      joinedAt: Date.now(),
    });

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    callback({ roomCode, peers: roomManager.getPeerList(roomCode) });
  });

  socket.on("join-room", ({ roomCode, deviceName }, callback) => {
    const room = roomManager.getRoom(roomCode);

    if (!room) {
      callback({ error: "Room not found" });
      return;
    }

    roomManager.addPeer(roomCode, {
      socketId: socket.id,
      deviceName,
      joinedAt: Date.now(),
    });

    socket.join(roomCode);
    socket.data.roomCode = roomCode;

    callback({ roomCode, peers: roomManager.getPeerList(roomCode) });

    socket.to(roomCode).emit("peer-joined", {
      socketId: socket.id,
      deviceName,
    });
  });

  socket.on("signal", ({ targetSocketId, data }) => {
    io.to(targetSocketId).emit("signal", {
      fromSocketId: socket.id,
      data,
    });
  });

  socket.on("disconnect", () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;

    roomManager.removePeer(roomCode, socket.id);
    socket.to(roomCode).emit("peer-left", { socketId: socket.id });
  });
}
