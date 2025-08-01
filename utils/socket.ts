// utils/socket.ts
import { io } from "socket.io-client";
const SOCKET_URL = "https://chat-app-server-4x0f.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // 🚫 important: disable auto connect
  reconnection: false,
});

export default socket;
