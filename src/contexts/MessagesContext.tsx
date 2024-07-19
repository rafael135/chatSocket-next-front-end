"use client"

import { MessageImageType, MessageType } from "@/types/Message";
import { User } from "@/types/User";
import { ReactNode, createContext, useState } from "react";



type MessageTypeGeneral = {
    author: User | null;
    messages: MessageType[];
}

type MessageContextType = {
    messages: MessageTypeGeneral[];
    setMessages: React.Dispatch<React.SetStateAction<MessageTypeGeneral[]>>;
}

export const MessagesContext = createContext<MessageContextType | null>(null);


export const MessagesProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<MessageTypeGeneral[]>([]);


    return (
        <MessagesContext.Provider value={{ messages: messages, setMessages: setMessages }}>
            { children }
        </MessagesContext.Provider>
    )
}