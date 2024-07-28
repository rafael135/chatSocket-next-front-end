import { MessageType } from "./Message";


export type User = {
    uuid: string;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
    iat?: number;
    exp?: number;
}

export type UserFriend = {
    uuid: string;
    isFriend: boolean;
    isPending: boolean;
    avatarSrc?: string;
    name: string;
    nickName: string;
    email: string;
    worker?: Worker;
    createdAt: string;
    updatedAt: string;

    messages: MessageType[];
};