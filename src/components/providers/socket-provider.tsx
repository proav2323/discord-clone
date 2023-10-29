"use client"
import { Socket } from "net";

import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIo } from "socket.io-client";

type socketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const socketContext = createContext<socketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocet] = useState(null);
  const [isConnect, setIsConnected] = useState(false);

  useEffect(() => {
    const SocketIntece = new (ClientIo as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );

    SocketIntece.on("connect", () => {
      setIsConnected(true);
    });

    SocketIntece.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocet(SocketIntece);

    return () => {
      SocketIntece.disconnect();
    };
  }, []);
  return (
  <socketContext.Provider value={{  socket: socket, isConnected: isConnect}}>
    {children}
  </socketContext.Provider>
  );
};
