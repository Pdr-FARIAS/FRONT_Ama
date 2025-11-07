import { io } from "socket.io-client";


const URL = "http://localhost:3000";

export const socket = io(URL, {
    autoConnect: true,
    reconnection: true,
});


socket.on("connect", () => {
    console.log("Socket.io Conectado:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Socket.io Desconectado");
});