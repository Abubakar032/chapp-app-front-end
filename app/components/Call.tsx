import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:6363/";

const VideoCall = ({ currentUserId, selectedUserId }: any) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [inCall, setInCall] = useState(false);
  const [calling, setCalling] = useState(false);
  const [calleeId, setCalleeId] = useState<string | null>(null);

  const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    const s = io(SOCKET_SERVER_URL);
    setSocket(s);

    s.emit("register", currentUserId);

    s.on("call-made", ({ offer, from }) => {
      setIncomingCall({ offer, from });
    });

    s.on("answer-made", async ({ answer }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        setInCall(true);
        setCalling(false);
      }
    });

    s.on("ice-candidate", async ({ candidate }) => {
      if (candidate && peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    s.on("call-rejected", () => {
      alert("Call was rejected");
      setCalling(false);
      endCall(); // cleanup
    });

    s.on("call-cancelled", () => {
      alert("Caller cancelled the call");
      setIncomingCall(null);
    });

    return () => {
      s.disconnect();
    };
  }, [currentUserId]);

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(iceServers);

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", {
          to: calleeId || incomingCall?.from,
          candidate: event.candidate,
        });
      }
    };
  };

  const startMedia = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error("🎥 Failed to access camera/mic:", err);
      alert("Camera or microphone is already in use or access denied.");
      throw err;
    }
  };

  const callUser = async () => {
    if (!socket || !selectedUserId) return;

    createPeerConnection();
    setCalling(true);
    setCalleeId(selectedUserId);

    try {
      const stream = await startMedia();
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      const offer = await peerConnection.current!.createOffer();
      await peerConnection.current!.setLocalDescription(offer);

      socket.emit("call-user", { to: selectedUserId, offer });
    } catch {
      setCalling(false);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall || !socket) return;

    try {
      setCalleeId(incomingCall.from);
      createPeerConnection();

      const stream = await startMedia();
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      await peerConnection.current!.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      const answer = await peerConnection.current!.createAnswer();
      await peerConnection.current!.setLocalDescription(answer);

      socket.emit("make-answer", {
        to: incomingCall.from,
        answer,
      });

      setInCall(true);
      setIncomingCall(null);
    } catch (err) {
      console.error("❌ Error accepting call:", err);
      alert(
        "Failed to accept the call. Try closing other apps using the camera."
      );
      endCall();
    }
  };

  const rejectCall = () => {
    if (socket && incomingCall) {
      socket.emit("reject-call", { to: incomingCall.from });
      setIncomingCall(null);
    }
  };

  const cancelCall = () => {
    if (socket && selectedUserId) {
      socket.emit("cancel-call", { to: selectedUserId });
      setCalling(false);
    }
  };

  const endCall = () => {
    peerConnection.current?.close();
    peerConnection.current = null;
    setInCall(false);
    setCalling(false);
    setIncomingCall(null);

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  };

  return (
    <div>
      {/* Incoming Call UI */}
      {incomingCall && !inCall && (
        <div className="fixed top-10 right-10 bg-gray-800 text-white p-4 rounded-xl shadow-lg">
          <p>📞 Incoming Call...</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={acceptCall}
              className="bg-green-600 px-3 py-1 rounded"
            >
              Accept
            </button>
            <button
              onClick={rejectCall}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Video Display */}
      {inCall && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-1/2 border-4 border-purple-600 rounded-lg"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-1/2 border-4 border-green-600 rounded-lg ml-4"
          />

          <button
            onClick={endCall}
            className="absolute top-4 right-4 text-white bg-red-700 px-4 py-2 rounded-full"
          >
            ❌ End Call
          </button>
        </div>
      )}

      {/* Call Button */}
      {!inCall && !incomingCall && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={callUser}
            disabled={!selectedUserId || calling}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {calling ? "Calling..." : "Call"}
          </button>
          {calling && (
            <button
              onClick={cancelCall}
              className="bg-gray-600 text-white px-3 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoCall;
