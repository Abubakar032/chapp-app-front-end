// utils/socket.ts
import { io } from "socket.io-client";
const SOCKET_URL =  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:6363";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // 🚫 important: disable auto connect
  reconnection: false,
});

export default socket;
