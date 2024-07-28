import Paragraph from "@/components/Atoms/Paragraph";
import ContextMenuItem from "@/components/Molecules/ContextMenuItem";
import { addOrRemoveFriend } from "@/lib/actions";
import { SelectedChatInfo } from "@/types/Message";
import { User, UserFriend } from "@/types/User";
import Image from "next/image";
import { MouseEvent, useContext } from "react";
import { BsPersonFill, BsThreeDotsVertical } from "react-icons/bs";
import styled from "styled-components";

import { AnimatePresence, motion } from "framer-motion";
import { MenuContext } from "@/contexts/MenuContext";
import { ChatContext } from "@/contexts/ChatContext";



const StyledUserCard = styled.div.attrs(() => ({}))`
    position: relative;
    width: 100%;
    height: 66px;
    padding-left: 0.25rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    //border-bottom: 1px solid rgb(75 85 99 / 0.4);
    cursor: pointer;
    border: 1px solid rgb(75 85 99 / 0.4);
    border-radius: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    gap: 4px;

    
    &.selected {
        //background-color: rgb(28 100 242);
        //color: #FFF;
        border-color: rgb(28 100 242);
    }
    &.selected p {
        //color: #FFF;
    }

    &.selected svg {
        
    }
`;


type props = {
    idx: number;
    friend: UserFriend;
    isSelected: boolean;
    className?: string;
}

const FriendCard = ({ idx, friend, isSelected, className }: props) => {
    
    const chatCtx = useContext(ChatContext)!;
    const menuCtx = useContext(MenuContext)!;

    const handleRemoveFriendBtn = async () => {
        let res = await addOrRemoveFriend(friend.uuid);

        if(res == null) {
            chatCtx.dispatchFriends({
                type: "del",
                friend: friend
            });
            menuCtx.setShowContextMenu(false);
        }
    }
    
    const handleUserOptions = (e: MouseEvent<HTMLDivElement>) => {
        menuCtx.setContextMenuPositionX(e.pageX);
        menuCtx.setContextMenuPositionY(e.pageY);

        menuCtx.setContextMenuItems(
            <>
                <ContextMenuItem
                    onClick={handleRemoveFriendBtn}
                >
                    Excluir
                </ContextMenuItem>
            </>
        );

        menuCtx.setShowContextMenu(true);
    }

    const handleSelectChat = () => {
        chatCtx.setActiveChat({ index: idx, name: friend.name, srcImg: friend.avatarSrc, type: "user", uuid: friend.uuid });
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{
                    x: 400
                }}

                animate={{
                    x: 0
                }}

                transition={{
                    duration: 0.6,
                    type: "spring"
                }}

                exit={{ x: 500 }}
            >
                <StyledUserCard className={className} onClick={handleSelectChat}>
                    <div className="relative h-12 w-12 max-w-12 max-h-12 flex justify-center items-center border border-solid border-gray-600/40 bg-white rounded-full">
                        {(friend?.avatarSrc != null) &&
                            <Image
                                loading="lazy"
                                width={40}
                                height={40}
                                quality={100}
                                src={`/${friend.avatarSrc}`}
                                alt="Avatar"
                                className="rounded-full"
                            />
                        }

                        {(friend?.avatarSrc == null) &&
                            <BsPersonFill className="w-10 h-auto fill-slate-700" />
                        }

                        <span className="absolute -bottom-1.5 -left-1.5 flex justify-center items-center h-6 w-6 bg-blue-600 text-white text-xs rounded-full">2</span>
                    </div>

                    <Paragraph className="flex-1 mt-0.5 text-slate-800 text-lg font-normal truncate">{friend.name}</Paragraph>

                    <div
                        className="w-6 h-6 absolute top-2 right-2 flex justify-center items-center transition-all rounded-full hover:bg-gray-600/40 active:bg-gray-600/60 group"
                        onClick={(e) => handleUserOptions(e)}
                    >
                        <BsThreeDotsVertical className="w-4 h-auto bg-transparent fill-slate-700 group-hover:fill-blue-600" />
                    </div>
                </StyledUserCard>
            </motion.div>
        </AnimatePresence>
    );
}

export default FriendCard;