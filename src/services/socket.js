// src/services/socket.js
import { io } from "socket.io-client";

export const socket = io("http://localhost:7000", {
  transports: ["websocket"],
});
