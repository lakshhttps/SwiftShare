import { useState } from "react";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  const [room, setRoom] = useState(null);

  function handleEnterRoom(roomCode, peers) {
    setRoom({ roomCode, peers });
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
          onLeaveRoom={() => setRoom(null)}
        />
      ) : (
        <Home onEnterRoom={handleEnterRoom} />
      )}
    </div>
  );
}

export default App;
