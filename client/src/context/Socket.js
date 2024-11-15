import { createContext } from "react";
import io from 'socket.io-client';

const socket = io.connect("http://localhost:8080");

console.log(socket);
export const Socket = createContext(socket);