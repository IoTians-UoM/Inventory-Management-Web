import { Type, Message, Action, InventoryItem } from "../types/types";
import { sendWSMessage } from "../utils/websocket-util";

export async function getAllInventory() {
  const request: Message = {
    action: Action.INVENTORY_GET_ALL,
    type: Type.REQUEST,
    message_id: '1',
    timestamp: Date.now().toString(),
  };

  // Send the WebSocket message to fetch inventory data
  sendWSMessage(request);
}

export async function createInventory(inventoryItems: InventoryItem[]) {
    const request: Message = {
      action: Action.INVENTORY_ADD_EDIT,
      type: Type.REQUEST,
      message_id: Date.now().toString(),
      timestamp: Date.now().toString(),
      payload: {
        inventory_items: inventoryItems,
        timestamp: new Date().toISOString(),
      },
    };
  
    // Send the WebSocket message to add or edit inventory items
    sendWSMessage(request);
  }

export async function deleteInventory(inventoryItemId: string) {
  const request: Message = {
    action: Action.INVENTORY_DELETE,
    type: Type.REQUEST,
    message_id: Date.now().toString(),
    timestamp: Date.now().toString(),
    payload: {
        product_id: inventoryItemId,
      timestamp: new Date().toISOString(),
    },
  };

  // Send the WebSocket message to delete an inventory item
  sendWSMessage(request);
}


