import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerRoomHandlers } from "./socket/roomHandlers.js";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: CLIENT_ORIGIN, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  registerRoomHandlers(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
