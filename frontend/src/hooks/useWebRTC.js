import { useEffect, useRef, useState } from "react";
import { socket } from "../utils/socket";
import { sendSignal, onSignal } from "../utils/signaling";

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }];

export function useWebRTC(otherSocketId) {
  const [connectionState, setConnectionState] = useState("idle");
  const pcRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!otherSocketId) return;

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        sendSignal(otherSocketId, { type: "ice-candidate", candidate: e.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
    };

    function setupChannel(channel) {
      channelRef.current = channel;
      channel.onopen = () => setConnectionState("channel-open");
      channel.onclose = () => setConnectionState("channel-closed");
    }

    pc.ondatachannel = (e) => {
      setupChannel(e.channel);
    };

    const isInitiator = socket.id < otherSocketId;

    if (isInitiator) {
      const channel = pc.createDataChannel("file-transfer");
      setupChannel(channel);

      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer);
        sendSignal(otherSocketId, { type: "offer", offer });
      });
    }

    const removeSignalListener = onSignal(async ({ fromSocketId, data }) => {
      if (fromSocketId !== otherSocketId) return;

      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal(otherSocketId, { type: "answer", answer });
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === "ice-candidate") {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    return () => {
      removeSignalListener();
      pc.close();
      pcRef.current = null;
      channelRef.current = null;
      setConnectionState("idle");
    };
  }, [otherSocketId]);

  return { connectionState, dataChannel: channelRef.current };
}
