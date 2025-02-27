import { Message } from "../types/types";

let socket: WebSocket | null = null;

export default function initWS(url: string, setIncomingQueue: (msg: string) => void) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket Connected");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    try {
      // if (typeof event.data === "string") {
      //   setIncomingQueue(JSON.parse(event.data));
      //   return;
      // }
      setIncomingQueue(event.data);
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  socket.onclose = (event) => {
    console.log("WebSocket Disconnected", event.reason);
    // Attempt to reconnect after a delay
    setTimeout(() => {
      console.log("Reconnecting WebSocket...");
      initWS(url, setIncomingQueue);
    }, 3000); // 3-second delay before reconnecting
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
    socket?.close();
  };

  return socket;
}

export function sendWSMessage(message: Message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("WebSocket not connected. Message not sent.");
  }
}
