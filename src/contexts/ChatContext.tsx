"use client"

import { Group } from "@/types/Group";
import { MessageType, SelectedChatInfo } from "@/types/Message";
import { UserFriend } from "@/types/User";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useLayoutEffect, useMemo, useReducer, useState } from "react";
import { MessagesContext } from "./MessagesContext";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";
import friendsReducer from "@/reducers/friendsReducer";
import { groupsReducer } from "@/reducers/groupsReducer";
import { MessageAction, UserFriendAction, UserGroupAction } from "@/types/Reducer";
import { useRouter } from "next/navigation";
import { getGroupMessages, getUserFriends, getUserGroups, getUserMessages } from "@/lib/actions";
import { messagesReducer } from "@/reducers/messagesReducer";
import { queryClient } from "@/utils/queryClient";


type ChatContextType = {
    activeChat: SelectedChatInfo | null;
    setActiveChat: Dispatch<SetStateAction<SelectedChatInfo | null>>;
    activeMessages: MessageType[];
    dispatchActiveMessages: Dispatch<MessageAction>;
    friends: UserFriend[];
    dispatchFriends: Dispatch<UserFriendAction>;
    friendsMessages: MessageType[];
    dispatchFriendsMessages: Dispatch<MessageAction>;
    groups: Group[];
    dispatchGroups: Dispatch<UserGroupAction>;
    groupsMessages: MessageType[];
    dispatchGroupsMessages: Dispatch<MessageAction>;
};

export const ChatContext = createContext<ChatContextType | null>(null);


const FRIENDS_LOCAL_KEY = "chatSocketFriends";
const FRIENDS_MESSAGES_LOCAL_KEY = "chatSocketFriendsMessages";
const GROUPS_LOCAL_KEY = "chatSocketGroups";
const GROUPS_MESSAGES_LOCAL_KEY = "chatSocketGroupsMessages";


export const ChatContextProvider = ({ children }: { children: ReactNode }) => {

    const router = useRouter();

    const userCtx = useContext(UserContext)!;
    //const messagesCtx = useContext(MessagesContext)!;
    const socketCtx = useContext(SocketContext)!;

    const [activeChat, setActiveChat] = useState<SelectedChatInfo | null>(null);
    const [activeMessages, dispatchActiveMessages] = useReducer(messagesReducer, []);
    //const [messages, setMessages] = useState<MessageType[]>([]);


    const [friends, dispatchFriends] = useReducer(friendsReducer, []);
    const [friendsMessages, dispatchFriendsMessages] = useReducer(messagesReducer, []);
    const [groups, dispatchGroups] = useReducer(groupsReducer, []);
    const [groupsMessages, dispatchGroupsMessages] = useReducer(messagesReducer, []);


    useLayoutEffect(() => {
        if (userCtx.initialized != true || socketCtx.socket?.connected != true) {
            return;
        }



    }, [userCtx.initialized, friendsMessages, groupsMessages]);


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
    }, [socketCtx.socket, userCtx.initialized, userCtx.user]);

    useEffect(() => {
        if (friends.length == 0) {
            return;
        }

        for (let i = 0; i < friends.length; i++) {
            getUserMessages(friends[i].uuid).then((res) => {
                //console.log(res);
                queryClient.setQueryData(["user", friends[i].uuid], res);
            }).catch((e) => {

            });
        }
    }, [friends]);

    useEffect(() => {
        if (groups.length == 0) {
            return;
        }

        for (let i = 0; i < groups.length; i++) {
            getGroupMessages(groups[i].uuid).then((res) => {
                //console.log(res);
                queryClient.setQueryData(["group", groups[i].uuid], res);
            }).catch((e) => {

            });
        }
    }, [groups]);




    useMemo(() => {
        if (friends.length > 0) {
            window.localStorage.setItem(FRIENDS_LOCAL_KEY, JSON.stringify(friends));
        }
    }, [friends]);

    useMemo(() => {
        if (groups.length > 0) {
            window.localStorage.setItem(GROUPS_LOCAL_KEY, JSON.stringify(groups));
        }
    }, [groups]);

    useMemo(() => {
        if (friendsMessages.length > 0) {
            window.localStorage.setItem(FRIENDS_MESSAGES_LOCAL_KEY, JSON.stringify(friendsMessages));
        }
    }, [friendsMessages]);

    useMemo(() => {
        if (groupsMessages.length > 0) {
            window.localStorage.setItem(GROUPS_MESSAGES_LOCAL_KEY, JSON.stringify(groupsMessages));
        }
    }, [groupsMessages]);

    return (
        <ChatContext.Provider
            value={{
                activeChat: activeChat, setActiveChat: setActiveChat,
                activeMessages: activeMessages, dispatchActiveMessages: dispatchActiveMessages,
                friends: friends, dispatchFriends: dispatchFriends,
                friendsMessages: friendsMessages, dispatchFriendsMessages: dispatchFriendsMessages,
                groups: groups, dispatchGroups: dispatchGroups,
                groupsMessages: groupsMessages, dispatchGroupsMessages: dispatchGroupsMessages
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

