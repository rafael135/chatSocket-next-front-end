import { MessageType } from "@/types/Message";
import { MessageAction } from "@/types/Reducer";

export const messagesReducer = (messages: MessageType[], action: MessageAction) => {
    switch(action.type) {
        case "add":
            return [...messages, action.message!];
        case "del":
            return [...messages.filter((msg) => (msg.author!.uuid != action.message!.author!.uuid) && (msg.time != action.message!.time))];
        case "initialize":
            return [...action.initialState!];
    }
}