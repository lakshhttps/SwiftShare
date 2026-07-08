/**
 * Mirrors backend/src/types/room.js.
 * Kept as a separate copy on purpose — see the comment in the backend file
 * for the reasoning (no shared workspace package in this project).
 *
 * @typedef {Object} Peer
 * @property {string} socketId
 * @property {string} deviceName
 * @property {number} joinedAt
 *
 * @typedef {Object} RoomJoinedPayload
 * @property {string} roomCode
 * @property {Array<{socketId: string, deviceName: string}>} peers
 *
 * @typedef {Object} PeerJoinedPayload
 * @property {string} socketId
 * @property {string} deviceName
 *
 * @typedef {Object} SignalPayload
 * @property {string} targetSocketId
 * @property {string} fromSocketId
 * @property {*} data
 */

export {};
