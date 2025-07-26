// utils/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:6363", {
  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
