export function saveActiveRoom(roomCode, deviceName) {
  sessionStorage.setItem("activeRoom", JSON.stringify({ roomCode, deviceName }));
}

export function getActiveRoom() {
  const raw = sessionStorage.getItem("activeRoom");
  return raw ? JSON.parse(raw) : null;
}

export function clearActiveRoom() {
  sessionStorage.removeItem("activeRoom");
}
