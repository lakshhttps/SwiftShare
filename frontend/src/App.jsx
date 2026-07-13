import { useEffect, useState } from "react";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import { Room } from "./pages/Room";
import { ThemeToggle } from "./components/ThemeToggle";
import { Footer } from "./components/Footer";
import { Logo } from "./components/Logo";
import { socket } from "./utils/socket";
import { getActiveRoom, saveActiveRoom, clearActiveRoom } from "./utils/activeRoom";
import { getDeviceName } from "./utils/deviceName";

function App() {
  const [view, setView] = useState("landing");
  const [room, setRoom] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    function handleDisconnect() {
      if (view === "room") {
        setIsReconnecting(true);
      }
    }

    function handleConnect() {
      if (!isReconnecting) return;

      const saved = getActiveRoom();
      if (!saved) {
        setIsReconnecting(false);
        return;
      }

      socket.emit(
        "join-room",
        { roomCode: saved.roomCode, deviceName: saved.deviceName },
        (response) => {
          if (!response.error) {
            setRoom({ roomCode: response.roomCode, peers: response.peers });
          }
          setIsReconnecting(false);
        }
      );
    }

    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("disconnect", handleDisconnect);
      socket.off("connect", handleConnect);
    };
  }, [view, isReconnecting]);

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
      <div className="absolute top-4 left-4">
        <Logo iconClassName="h-8" textClassName="text-lg" />
      </div>

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {isReconnecting && (
        <div className="fixed top-0 inset-x-0 bg-amber-500 text-white text-sm text-center py-1.5 z-50">
          Connection lost. Reconnecting…
        </div>
      )}

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
