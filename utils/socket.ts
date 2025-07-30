// utils/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:6363", {
  transports: ["websocket"],
  autoConnect: false, // 🚫 important: disable auto connect
  reconnection: false,
});

export default socket;
