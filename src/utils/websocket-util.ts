import { Message } from "../types/types";

let socket: WebSocket;

export default function initWS(url: string, setIncommingQueue: Function) {
  if (socket) {
    return socket;
  }

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('WebSocket Connected');
  };

  socket.onmessage = (event) => {
    console.log('Message from server:', event.data);
    // Directly call setIncommingQueue with parsed message data
    setIncommingQueue(JSON.parse(event.data));
  };

  socket.onclose = () => {
    console.log('WebSocket Disconnected');
  };
}

export function sendWSMessage(message: Message) {
  socket.send(JSON.stringify(message));
}


