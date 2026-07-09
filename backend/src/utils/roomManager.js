class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  generateRoomCode() {
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
    if (room.peers.size === 0) this.rooms.delete(code);
  }

  findRoomBySocketId(socketId) {
    for (const room of this.rooms.values()) {
      if (room.peers.has(socketId)) return room;
    }
    return undefined;
  }

  getPeerList(code) {
    const room = this.rooms.get(code);
    if (!room) return [];
    return Array.from(room.peers.values()).map((p) => ({
      socketId: p.socketId,
      deviceName: p.deviceName,
    }));
  }
}

export const roomManager = new RoomManager();
