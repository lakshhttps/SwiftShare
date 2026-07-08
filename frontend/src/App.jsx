import { useState } from "react";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { ThemeToggle } from "./components/ThemeToggle";

/**
 * Two "pages", switched by plain state instead of a router library.
 * With only two screens and no browser back/forward or shareable URLs
 * needed yet, react-router would be extra weight for no real benefit.
 * If deep-linking (e.g. /room/123456) becomes a real need later, this
 * is the point where we'd swap in a router.
 */
function App() {
  const [roomCode, setRoomCode] = useState(null);

  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {roomCode ? (
        <Room roomCode={roomCode} onLeaveRoom={() => setRoomCode(null)} />
      ) : (
        <Home onEnterRoom={setRoomCode} />
      )}
    </div>
  );
}

export default App;
