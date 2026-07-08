/**
 * In-memory room store.
 *
 * Why no database (Redis/Postgres/etc.)?
 * Rooms are ephemeral — they exist only for the duration of a transfer
 * session and hold no data worth persisting (no user accounts, no file
 * content passes through the server at all — that's the whole point of
 * using WebRTC data channels). A plain Map is O(1) for lookups and requires
 * zero infra. The trade-off: state is lost on server restart, and this
 * won't scale horizontally across multiple server instances without moving
 * to something like Redis pub/sub for Socket.IO's adapter. Worth mentioning
 * in interviews as a known scaling limitation you consciously accepted.
 */
class RoomManager {
  constructor() {
    /** @type {Map<string, import('../types/room.js').Room>} */
    this.rooms = new Map();
  }

  generateRoomCode() {
    // 6-digit numeric code — short enough to type manually on a second device
    // if QR scanning isn't available, long enough to avoid frequent collisions.
    let code;
    do {
      code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (this.rooms.has(code));
    return code;
  }

  createRoom(code) {
    const room = {
      code,
      createdAt: Date.now(),
      peers: new Map(),
    };
    this.rooms.set(code, room);
    return room;
  }

  getRoom(code) {
    return this.rooms.get(code);
  }

  addPeer(code, peer) {
    const room = this.rooms.get(code);
    if (room) room.peers.set(peer.socketId, peer);
  }

  removePeer(code, socketId) {
    const room = this.rooms.get(code);
    if (!room) return;
    room.peers.delete(socketId);
    if (room.peers.size === 0) this.rooms.delete(code); // auto-cleanup empty rooms
  }

  findRoomBySocketId(socketId) {
    for (const room of this.rooms.values()) {
      if (room.peers.has(socketId)) return room;
    }
    return undefined;
  }
}

// Singleton — one shared instance across the app's lifetime.
export const roomManager = new RoomManager();
