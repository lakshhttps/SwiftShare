import { useEffect, useState } from "react";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { ThemeToggle } from "./components/ThemeToggle";
import { socket } from "./utils/socket";
import { getActiveRoom, clearActiveRoom } from "./utils/activeRoom";

function App() {
  const [room, setRoom] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const saved = getActiveRoom();
    if (!saved) {
      setCheckingSession(false);
      return;
    }

    socket.emit(
      "join-room",
      { roomCode: saved.roomCode, deviceName: saved.deviceName },
      (response) => {
        if (response.error) {
          clearActiveRoom();
        } else {
          setRoom({ roomCode: response.roomCode, peers: response.peers });
        }
        setCheckingSession(false);
      }
    );
  }, []);

  function handleEnterRoom(roomCode, peers) {
    setRoom({ roomCode, peers });
  }

  function handleLeaveRoom() {
    clearActiveRoom();
    setRoom(null);
  }

  if (checkingSession) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {room ? (
        <Room
          roomCode={room.roomCode}
          initialPeers={room.peers}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <Home onEnterRoom={handleEnterRoom} />
      )}
    </div>
  );
}

export default App;
