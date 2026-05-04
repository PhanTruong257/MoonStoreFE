import { io, type Socket } from "socket.io-client";

import { env } from "@/app/config/env";

let socket: Socket | null = null;

const createSocket = (): Socket =>
  io(env.apiBaseUrl, {
    withCredentials: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

export const getChatSocket = (): Socket => {
  if (!socket) {
    socket = createSocket();
  }
  return socket;
};

export const connectChatSocket = (): Socket => {
  const instance = getChatSocket();
  if (!instance.connected) {
    instance.connect();
  }
  return instance;
};

export const disconnectChatSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
