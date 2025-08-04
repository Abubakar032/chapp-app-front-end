// utils/socket.ts
import { io } from "socket.io-client";


export const Base_Url = "https://chat-app-server-4x0f.onrender.com";
// export const Base_Url =  "http://localhost:6363/";


const socket = io(Base_Url, {
  transports: ["websocket"],
  autoConnect: false, // 🚫 important: disable auto connect
  reconnection: false,
});

export default socket;
