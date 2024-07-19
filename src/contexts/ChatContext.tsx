"use client"

import { Group } from "@/types/Group";
import { MessageType, SelectedChatInfo } from "@/types/Message";
import { UserFriend } from "@/types/User";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useLayoutEffect, useReducer, useState } from "react";
import { MessagesContext } from "./MessagesContext";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";
import friendsReducer from "@/reducers/friendsReducer";
import { groupsReducer } from "@/reducers/groupsReducer";
import { UserFriendAction, UserGroupAction } from "@/types/Reducer";
import { useRouter } from "next/navigation";
import { getUserFriends, getUserGroups } from "@/lib/actions";


type ChatContextType = {
    activeChat: SelectedChatInfo | null;
    setActiveChat: Dispatch<SetStateAction<SelectedChatInfo | null>>;
    messages: MessageType[];
    setMessages: Dispatch<SetStateAction<MessageType[]>>;
    friends: UserFriend[];
    setFriends: Dispatch<UserFriendAction>;
    groups: Group[];
    setGroups: Dispatch<UserGroupAction>;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

    const userCtx = useContext(UserContext)!;
    //const messagesCtx = useContext(MessagesContext)!;
    const socketCtx = useContext(SocketContext)!;

    const [activeChat, setActiveChat] = useState<SelectedChatInfo | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);


    const [friends, dispatchFriends] = useReducer(friendsReducer, []);
    const [groups, dispatchGroups] = useReducer(groupsReducer, []);


    useLayoutEffect(() => {
        if(userCtx.initialized != true) {
            return;
        }

        // Monitora se há uma nova mensagem em um usuário
        socketCtx.socket?.on("new_private_msg", (newMsg: MessageType) => {
            setMessages([...messages, newMsg]);

            /*
            let isAuthorKnow = messagesCtx!.messages.findIndex((aut) => aut.author!.uuid == newMsg.author!.uuid);

            if(isAuthorKnow == -1) {
                


                
                messagesCtx!.setMessages([...messagesCtx!.messages, {
                    author: newMsg.author,
                    messages: [newMsg]
                }]);
                
                
            } else {
                
                messagesCtx!.setMessages([...messagesCtx!.messages.map((aut, index) => {
                    if(isAuthorKnow == index) {
                        aut.messages = [...aut.messages, newMsg];
                    }
                    return aut;
                })]);
            }
            */
            
            
        });
    
        // Monitora se há uma nova mensagem em um grupo
        socketCtx.socket?.on("new_group_msg", (newMsg: MessageType) => {
            setMessages([...messages, newMsg]);

            /*
            let isGroupKnow = messagesCtx!.messages.findIndex((aut) => aut.author!.uuid == newMsg.author!.uuid);
            
            if(isGroupKnow == -1) {
                /*
                messagesCtx!.setMessages([...messagesCtx!.messages, {
                    author: newMsg.author,
                    messages: [newMsg]
                }]);
                

                
            } else {
                
                messagesCtx!.setMessages([...messagesCtx!.messages.map((aut, index) => {
                    if(isGroupKnow == index) {
                        aut.messages = [...aut.messages, newMsg];
                    }
                    return aut;
                })]);
                
            }
            */
        });

    }, [userCtx.initialized, messages]);


    useLayoutEffect(() => {
        if ((userCtx!.token == "" || userCtx.user == null) && userCtx.initialized == true) {
            router.push("/login");
            return;
        }

        if (userCtx?.user != null && userCtx.token != "" && userCtx.initialized == true) {
            getUserGroups(userCtx.user.uuid).then((res) => {
                dispatchGroups({
                    type: "initialize",
                    initialState: res
                });
            });

            getUserFriends(userCtx.user.uuid).then((res) => {
                dispatchFriends({
                    type: "initialize",
                    initialState: res
                });
                //console.log(res);
            });
        }

        if (userCtx?.token != "") {
            socketCtx.socket?.connect();
        }
    }, [socketCtx.socket, userCtx.initialized]);

    useEffect(() => {
        //console.log(messages);
    }, [messages])



    return(
        <ChatContext.Provider
            value={{ 
                activeChat: activeChat, setActiveChat: setActiveChat,
                messages: messages, setMessages: setMessages,
                friends: friends, setFriends: dispatchFriends,
                groups: groups, setGroups: dispatchGroups
            }}
        >
            { children }
        </ChatContext.Provider>
    );
}

