import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { QueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { queryKeys } from "../lib/queryKeys";

// Default same-origin (Vite dev proxy /socket.io → API). Override via VITE_API_URL
// jika frontend dipisah dari API (mis. production).
const SOCKET_URL = import.meta.env.VITE_API_URL ?? undefined;

interface ServerSocketValue {
  socket: Socket | null;
  connected: boolean;
  connectedAt: number | null;
}

const ServerSocketContext = createContext<ServerSocketValue>({
  socket: null,
  connected: false,
  connectedAt: null,
});

export function ServerSocketProvider({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  const [connected, setConnected] = useState(false);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (socketRef.current) return; // Hanya satu socket

    const socket = SOCKET_URL
      ? io(SOCKET_URL, { autoConnect: true, transports: ["websocket"] })
      : io({ autoConnect: true, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setConnectedAt(Date.now());
    });

    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));

    // Update TanStack Query cache saat event realtime masuk
    socket.on("server:status", (data: unknown) => {
      queryClient.setQueryData(queryKeys.server.status, data);
    });
    socket.on("server:resources", (data: unknown) => {
      queryClient.setQueryData(queryKeys.server.resources, data);
    });
    socket.on("player:join", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    });
    socket.on("player:leave", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    });
    socket.on("player:event", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activity.all });
    });
    socket.on("player:dimension", () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players.all });
    });
    socket.on("players:update", (data: unknown) => {
      queryClient.setQueryData(queryKeys.players.online, data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return (
    <ServerSocketContext.Provider
      value={{ socket: socketRef.current, connected, connectedAt }}
    >
      {children}
    </ServerSocketContext.Provider>
  );
}

export function useServerSocket(): ServerSocketValue {
  return useContext(ServerSocketContext);
}