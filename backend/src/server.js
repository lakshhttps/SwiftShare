import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Simple health check — useful for Render's health checks and for you to
// confirm the server booted correctly during local dev.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const httpServer = createServer(app);

// We wrap Express's http server with Socket.IO rather than running Socket.IO
// standalone, because we want both a REST-style /health endpoint AND
// WebSocket signaling on the same port — simpler to deploy as one service.
const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });

  // Room creation/joining and WebRTC signaling handlers are added in Phase 4.
});

httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
