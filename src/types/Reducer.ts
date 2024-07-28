import { Group } from "./Group";
import { MessageType } from "./Message";
import { UserFriend } from "./User";

export type ActionType = {
    id?: number;
    type: string;
};

export type UserFriendAction = {
    initialState?: UserFriend[];
    type: "add" | "del" | "initialize";
    friend?: UserFriend;
};

export type MessageAction = {
    initialState?: MessageType[];
    type: "add" | "del" | "initialize";
    message?: MessageType;
};

export type UserGroupAction = {
    initialState?: Group[];
    type: "add" | "del" | "initialize";
    group?: Group;
};