// utils/socket.ts
import { io } from "socket.io-client";

import { Base_Url } from "@/app/config/configUrl";

const SOCKET_URL = process.env.REACT_APP_BASE_URL || "http://localhost:6363";

const socket = io(Base_Url, {
  transports: ["websocket"],
  autoConnect: false, // 🚫 important: disable auto connect
  reconnection: false,
});

export default socket;
