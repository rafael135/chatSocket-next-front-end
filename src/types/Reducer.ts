import { Group } from "./Group";
import { UserFriend } from "./User";

export type ActionType = {
    id?: number;
    type: string;
}

export type UserFriendAction = {
    initialState?: UserFriend[];
    type: "add" | "del" | "initialize";
    friend?: UserFriend;
};

export type UserGroupAction = {
    initialState?: Group[];
    type: "add" | "del" | "initialize";
    group?: Group;
};