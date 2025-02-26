import { Type, Message } from "../types/types";
import { sendWSMessage } from "../utils/websocket-util";

export async function getAllInventory() {
  const request: Message = {
    type: Type.INVENTORY,
    message_id: '1',
    timestamp: Date.now().toString(),
  };

  // Send the WebSocket message to fetch inventory data
  sendWSMessage(request);
}


