"use client"

import { MessageImageType, MessageType } from "@/types/Message";
import { User } from "@/types/User";
import { ReactNode, createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { SocketContext } from "./SocketContext";
import { queryClient } from "@/utils/queryClient";
import { ChatContext } from "./ChatContext";



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
    const socketCtx = useContext(SocketContext)!;
    const chatCtx = useContext(ChatContext)!;



    useLayoutEffect(() => {
        // Monitora se há uma nova mensagem em um usuário
        socketCtx.socket?.on("new_private_msg", (newMsg: MessageType) => {
            //dispatchFriendsMessages({ type: "add", message: newMsg });
            
            //console.log(newMsg)

            let previousData = queryClient.getQueryData(["user", newMsg.toUuid]) as MessageType[];

            console.log(previousData);

            if(previousData[previousData.length-1].time == newMsg.time) {
                return;
            }

            queryClient.setQueryData(["user", newMsg.toUuid], [...(queryClient.getQueryData(["user", newMsg.toUuid]) as MessageType[]), newMsg]);
            if (newMsg.toUuid == chatCtx.activeChat?.uuid) {
                chatCtx.dispatchActiveMessages({
                    type: "add",
                    message: newMsg
                });
            }
        });

        // Monitora se há uma nova mensagem em um grupo
        socketCtx.socket?.on("new_group_msg", (newMsg: MessageType) => {
            //dispatchGroupsMessages({ type: "add", message: newMsg });

            //console.log(newMsg)

            let previousData = queryClient.getQueryData(["group", newMsg.toUuid]) as MessageType[];

            console.log(previousData);

            if(previousData[previousData.length-1].time == newMsg.time) {
                return;
            }

            queryClient.setQueryData(["group", newMsg.toUuid], [...(queryClient.getQueryData(["group", newMsg.toUuid]) as MessageType[]), newMsg]);
            if (newMsg.toUuid == chatCtx.activeChat?.uuid) {
                chatCtx.dispatchActiveMessages({
                    type: "add",
                    message: newMsg
                });
            }
        });
    }, [socketCtx.socket])


    return (
        <MessagesContext.Provider value={{ messages: messages, setMessages: setMessages }}>
            {children}
        </MessagesContext.Provider>
    )
}