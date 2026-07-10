import { useEffect, useState } from "react";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";
import { socket } from "./utils/socket";
import { getActiveRoom, saveActiveRoom, clearActiveRoom } from "./utils/activeRoom";
import { getDeviceName } from "./utils/deviceName";

function App() {
  const [view, setView] = useState("landing");
  const [room, setRoom] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    function preventDefault(e) {
      e.preventDefault();
    }

    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);

    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  useEffect(() => {
    const saved = getActiveRoom();
    if (saved) {
      socket.emit(
        "join-room",
        { roomCode: saved.roomCode, deviceName: saved.deviceName },
        (response) => {
          if (response.error) {
            clearActiveRoom();
          } else {
            setRoom({ roomCode: response.roomCode, peers: response.peers });
            setView("room");
          }
          setCheckingSession(false);
        }
      );
      return;
    }

    const roomFromUrl = new URLSearchParams(window.location.search).get("room");
    if (roomFromUrl && roomFromUrl.length === 6) {
      const deviceName = getDeviceName();
      socket.emit(
        "join-room",
        { roomCode: roomFromUrl, deviceName },
        (response) => {
          window.history.replaceState({}, "", window.location.pathname);
          if (!response.error) {
            saveActiveRoom(response.roomCode, deviceName);
            setRoom({ roomCode: response.roomCode, peers: response.peers });
            setView("room");
          }
          setCheckingSession(false);
        }
      );
      return;
    }

    setCheckingSession(false);
  }, []);

  function handleEnterRoom(roomCode, peers) {
    setRoom({ roomCode, peers });
    setView("room");
  }

  function handleLeaveRoom() {
    socket.emit("leave-room");
    clearActiveRoom();
    setRoom(null);
    setView("home");
  }

  if (checkingSession) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {view === "landing" && <Landing onGetStarted={() => setView("home")} />}
      {view === "home" && <Home onEnterRoom={handleEnterRoom} />}
      {view === "room" && room && (
        <Room
          roomCode={room.roomCode}
          initialPeers={room.peers}
          onLeaveRoom={handleLeaveRoom}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
