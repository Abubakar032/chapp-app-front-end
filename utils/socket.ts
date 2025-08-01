// utils/socket.ts
import { io } from "socket.io-client";
import dotenv from "dotenv";
dotenv.config();
const SOCKET_URL =  process.env.REACT_APP_BASE_URL || "http://localhost:6363";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // 🚫 important: disable auto connect
  reconnection: false,
});

export default socket;
