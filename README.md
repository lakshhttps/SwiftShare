# SwiftShare

A web app for sending files directly between two devices using WebRTC, inspired by SHAREit's peer-to-peer transfer model. There's no upload step and no server-side storage — once two devices are connected, files move straight from one browser to the other over a peer-to-peer data channel.

## How it works

1. One device creates a room and gets a 6-digit code (or a QR code to scan).
2. The other device joins using that code.
3. A signaling server (Socket.IO) introduces the two devices to each other — this is the only part of the process that touches our server.
4. The two browsers negotiate a direct WebRTC connection using that introduction.
5. Files are sliced into chunks and streamed directly across that connection.

## Tech stack

- **Frontend:** React (JavaScript, JSX) + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Socket.IO
- **Transfer:** WebRTC (`RTCPeerConnection` + `RTCDataChannel`)
- **Database:** None — rooms are ephemeral and live in memory only

## Project structure

```
swiftshare/
├── backend/
│   └── src/
│       ├── server.js            Express + Socket.IO bootstrap
│       ├── socket/roomHandlers.js   Room join/leave + WebRTC signaling relay
│       └── utils/roomManager.js     In-memory room/peer store
└── frontend/
    └── src/
        ├── pages/                Landing, Home (create/join), Room (transfer)
        ├── components/           Button, Card, ThemeToggle
        ├── hooks/                useDarkMode, useWebRTC
        └── utils/                socket client, signaling, device name, session
```

## Why these choices

- **No database.** Rooms exist only for the length of a transfer session — an in-memory `Map` is enough, with an intentional trade-off: state resets if the server restarts, and this wouldn't scale across multiple server instances without something like Redis.
- **Socket.IO over raw WebSockets.** We rely on its automatic reconnection, room broadcasting, and acknowledgement-style callbacks — all things you'd otherwise hand-roll on top of plain WebSockets.
- **The server never sees file bytes.** Signaling only exchanges small JSON handshake messages (SDP offers/answers, ICE candidates). Actual file data flows directly between browsers over WebRTC.
- **Plain JavaScript, not TypeScript.** A deliberate choice for this project — trading compile-time type safety for a smaller, simpler codebase.

## Running locally

**Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the frontend URL in two browser tabs (or two devices on the same network) to test a transfer.

## Status

Actively being built in phases: room signaling and WebRTC connection setup are working; file transfer over the data channel, transfer progress, QR code joining, and reconnection handling are in progress.
