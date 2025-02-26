import { Message, Type } from "../types/types";
import { sendWSMessage } from "../utils/websocket-util";


export async function getAllProducts(){
    const request:Message = {
        type: Type.PRODUCT,
        message_id: '1',
        timestamp: Date.now().toString(),
    }

    sendWSMessage(request);
}

