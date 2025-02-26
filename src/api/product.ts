import { Action, Message, Product, Type } from "../types/types";
import { sendWSMessage } from "../utils/websocket-util";


export async function getAllProducts(){
    const request:Message = {
        action: Action.PRODUCT_GET_ALL,
        type: Type.REQUEST,
        message_id: '1',
        timestamp: Date.now().toString(),
    }

    sendWSMessage(request);
}

export async function createProduct(product: Product) {
    const request: Message = {
      action: Action.PRODUCT_ADD_EDIT,
      type: Type.REQUEST,
      message_id: Date.now().toString(),
      timestamp: Date.now().toString(),
      payload: {
        products: [product],
        timestamp: new Date().toISOString(),
      },
    };
  
    sendWSMessage(request);
  }

    export async function deleteProduct(productId: string) {
        const request: Message = {
        action: Action.PRODUCT_DELETE,
        type: Type.REQUEST,
        message_id: Date.now().toString(),
        timestamp: Date.now().toString(),
        payload: {
            product_id: productId,
            timestamp: new Date().toISOString(),
        },
        };
    
        sendWSMessage(request);
    }

    export async function writeTag(productId: string) {
        const request: Message = {
        action: Action.TAG_WRITE,
        type: Type.REQUEST,
        message_id: Date.now().toString(),
        timestamp: Date.now().toString(),
        payload: productId,
        };
    
        sendWSMessage(request);
    }