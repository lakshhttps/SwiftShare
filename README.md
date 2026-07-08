# ShareIt Clone — P2P File Transfer Web App

A SHAREit-inspired app that lets two devices transfer files directly to each
other using WebRTC data channels. The server only handles "signaling"
(introducing two peers to each other) — actual file bytes never touch it.

## Tech stack

- **Frontend:** React + JavaScript (JSX) + Vite + Tailwind CSS
- **Backend:** Node.js + Express + Socket.IO
- **File transfer:** WebRTC Data Channels
- **Database:** None (rooms are ephemeral, kept in memory)

## Monorepo layout

```
shareit-clone/
├── backend/     # Express + Socket.IO signaling server
└── frontend/    # React + JavaScript + Vite + Tailwind client
```

We use two independent npm projects (not a monorepo tool like Nx/Turborepo)
because the two apps deploy to entirely different platforms (Vercel vs
Render) and share almost no code — the small duplication in `types/room.js`
(JSDoc typedefs) is a reasonable trade-off for simplicity.

## Why plain JavaScript instead of TypeScript?

This project intentionally uses plain JS + JSDoc comments instead of
TypeScript. JSDoc `@typedef` blocks (see `src/types/room.js` in both
projects) still give editor autocomplete and documented shapes for the
Socket.IO event payloads, without a compile step. Trade-off: you lose
compile-time type checking across files — worth being able to explain that
trade-off in an interview.

## Getting started (local dev)

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev       # http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

## Status

This repo is being built incrementally, phase by phase, as a learning +
portfolio project.

- [x] Phase 1 — Project scaffolding
- [x] Phase 2 — UI design
- [ ] Phase 3 — Room creation/joining
- [ ] Phase 4 — Socket.IO signaling
- [ ] Phase 5 — WebRTC peer connection
- [ ] Phase 6 — File transfer via data channels
- [ ] Phase 7 — Transfer progress/speed
- [ ] Phase 8 — QR code join
- [ ] Phase 9 — Reconnection & error handling
- [ ] Phase 10 — Deployment
