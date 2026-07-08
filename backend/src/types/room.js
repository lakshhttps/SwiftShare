/**
 * Shared "shape" documentation for room + signaling data.
 *
 * We're using plain JavaScript for this project, so we don't have compile-time
 * interfaces like TypeScript. Instead, we document expected shapes with JSDoc
 * @typedef blocks. This buys us two things:
 *   1. Editor autocomplete/hover-hints in VS Code (it reads JSDoc even in .js files)
 *   2. A single source of truth for "what does a Room/Peer object look like"
 * without adding a TypeScript build step.
 *
 * @typedef {Object} Peer
 * @property {string} socketId
 * @property {string} deviceName
 * @property {number} joinedAt
 *
 * @typedef {Object} Room
 * @property {string} code
 * @property {number} createdAt
 * @property {Map<string, Peer>} peers
 * @property {string} [passwordHash] - optional, used by the password-protected rooms feature later
 *
 * @typedef {Object} CreateRoomPayload
 * @property {string} deviceName
 * @property {string} [password]
 *
 * @typedef {Object} JoinRoomPayload
 * @property {string} roomCode
 * @property {string} deviceName
 * @property {string} [password]
 *
 * @typedef {Object} SignalPayload
 * @property {string} targetSocketId
 * @property {string} fromSocketId
 * @property {*} data - SDP offer/answer or ICE candidate, opaque to the server
 */

// This file exports nothing at runtime — it exists purely for the JSDoc
// typedefs above, which other files reference via:
//   /** @type {import('./room.js').Room} */
export {};
