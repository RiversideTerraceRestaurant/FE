import { useEffect, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function endpoint(path: string, protocol: "http" | "ws") {
  const base = new URL(API_BASE_URL, window.location.origin);
  const url = new URL(`${base.pathname.replace(/\/$/, "")}${path}`, base.origin);
  if (protocol === "ws") url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

export function useBookingRealtime(onChange: () => void) {
  const callback = useRef(onChange);
  callback.current = onChange;

  useEffect(() => {
    let socket: WebSocket | undefined;
    let events: EventSource | undefined;
    let retry: number | undefined;
    let stopped = false;

    const handleMessage = (data: string) => {
      if (data.includes("booking.changed")) callback.current();
    };

    const connectSse = () => {
      if (stopped || events) return;
      events = new EventSource(endpoint("/api/events/bookings", "http"));
      events.addEventListener("booking.changed", (event) => handleMessage((event as MessageEvent).data));
      events.onerror = () => {
        events?.close();
        events = undefined;
        retry = window.setTimeout(API_BASE_URL.startsWith("/") ? connectSse : connectWebSocket, 3000);
      };
    };

    const connectWebSocket = () => {
      if (stopped) return;
      try {
        socket = new WebSocket(endpoint("/ws/bookings", "ws"));
        socket.onmessage = (event) => handleMessage(String(event.data));
        socket.onerror = () => socket?.close();
        socket.onclose = () => {
          socket = undefined;
          connectSse();
        };
      } catch {
        connectSse();
      }
    };

    // The production frontend reaches Elastic Beanstalk through a Vercel rewrite.
    // That proxy currently returns HTTP 400 for WebSocket upgrade requests, so use
    // the streaming realtime endpoint there. Direct deployments still use WebSocket.
    if (API_BASE_URL.startsWith("/")) connectSse();
    else connectWebSocket();
    return () => {
      stopped = true;
      if (retry) window.clearTimeout(retry);
      socket?.close();
      events?.close();
    };
  }, []);
}
