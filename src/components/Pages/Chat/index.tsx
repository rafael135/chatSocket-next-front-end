"use client"

import { UserContext } from "@/contexts/UserContext";
//import socket from "@/helpers/Socket";
import { User, UserFriend } from "@/types/User";
import { useContext, useState, useRef, useEffect, useLayoutEffect, ReactNode } from "react";

import { ImgSendType, MessageType, SelectedChatInfo } from "@/types/Message";

import { BsGearFill, BsPersonFillAdd, BsPlus } from "react-icons/bs";
import { SlEnvolopeLetter } from "react-icons/sl";
import { EmojiClickData } from "emoji-picker-react";
import MessagesContainer from "@/components/Organisms/MessagesContainer";
import AnnexedFile from "../../Molecules/AnexxedFile";
import { useRouter } from "next/navigation";
import FileInputModal from "../../Organisms/FileInputModal";
import { SocketContext } from "@/contexts/SocketContext";
import { Group } from "@/types/Group";
import { getUserGroups, getUserFriends } from "@/lib/actions";
import GroupCard from "../../Organisms/GroupCard";
import Button from "../../Atoms/Button";
import CreateNewGroupModal from "./Modals/CreateNewGroupModal";
import MsgInput from "../../Organisms/MsgInput";

import { Tabs, Tab, TabsHeader, TabsBody, TabPanel } from "@material-tailwind/react";
import FriendCard from "../../Organisms/FriendCard";
import styled from "styled-components";
import UserConfigModal from "./Modals/UserConfigModal";
import AddFriendModal from "./Modals/AddFriendModal";
import ContextMenu from "@/components/Molecules/ContextMenu";
import PendingInvitationsModal from "./Modals/PendingInvitationsModal";
import Paragraph from "@/components/Atoms/Paragraph";
import { MenuContext } from "@/contexts/MenuContext";
import ImageModal from "@/components/Organisms/ImageModal";
import { ChatContext } from "@/contexts/ChatContext";
import ShowChatPhotoModal from "./Modals/ShowChatPhotoModal";
import { MessagesContext } from "@/contexts/MessagesContext";

//import { headers } from "next/headers";



const StyledChatsContainer = styled.div({
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "center",
    gap: "0.5rem",
    padding: "0.375rem",
    overflowY: "scroll",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: "rgb(79, 134, 241) transparent"
});

const Chat = () => {

    // Contexto do usuario e mensagens
    const userCtx = useContext(UserContext)!;
    const chatCtx = useContext(ChatContext)!;
    const socketCtx = useContext(SocketContext)!;

    // Contexto para exibição de menus
    const menuCtx = useContext(MenuContext)!;



    const router = useRouter();

    // String do userName a ser setado no "login" e String do texto da caixa de mensagens
    const [msgInput, setMsgInput] = useState<string>("");

    // Array de arquivos selecionados
    const [files, setFiles] = useState<File[]>([]);

    // Referencia do elemento de input
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Armazena o emoji selecionado
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

    const handleFileDragEnter = (e: React.DragEvent) => {
        menuCtx.setShowFileInput(true);
    }

    const handleFileDragLeave = (e: React.DragEvent) => {

    }


    const handleEmojiClicked = (emoji: EmojiClickData) => {
        setSelectedEmoji(emoji.emoji);
    }

    // Monitora se um novo usuario entrou ao chat(emitido pelo servidor)
    socketCtx.socket!.on("new-user", (usr: User) => {
        //userCtx!.setUsersList([...userCtx!.usersList, usr]);
    });

    // Monitora a necessidade de alterar a lista de usuarios
    socketCtx.socket!.on("renew-users", (usrList: User[]) => {
        //userCtx?.setUsersList(usrList);
    });

    // Monitora se um usuario saiu do chat
    socketCtx.socket!.on("left-user", (userLeft: User) => {
        //messagesCtx?.setMessages([...messagesCtx.messages, { author: userLeft, msg: "", type: "exit-user" }]);
    });

    // Exibe uma mensagem de alerta caso a conexão com o servidor caia
    socketCtx.socket!.on("disconnect", () => {
        //messagesCtx?.setMessages([...messagesCtx.messages, { author: null, msg: "Conexão perdida com o host!", type: "error" }]);
        //userCtx?.setUsersList([]);
    });

    const handleShowCreateGroupBtn = () => {
        menuCtx.setShowCreateGroupModal(true);
    }

    const handleShowAddFriendBtn = () => {
        menuCtx.setShowAddFriendModal(true);
    }

    const handleConfigBtn = () => {
        menuCtx.setShowConfigModal(true);
    }

    const handlePendingInvitationsBtn = async () => {
        menuCtx.setShowPendingInvitations(true);
    }

    const handleClearFiles = async () => {
        setFiles([]);
    }

    useEffect(() => {
        if (files.length > 0) {
            menuCtx.setShowFileInput(false);
        }
    }, [files]);

    useEffect(() => {
        if (selectedEmoji != null) {
            setMsgInput(msgInput + selectedEmoji);
            setSelectedEmoji(null);
        }
    }, [selectedEmoji]);

    useEffect(() => {

        const handleClick = () => { menuCtx.setShowContextMenu(false); };

        if (menuCtx.showContextMenu == true) {
            setTimeout(() => {
                window.addEventListener("click", handleClick);
            }, 80);
        }

        return () => window.removeEventListener("click", handleClick);
    }, [menuCtx.showContextMenu]);

    return (
        <>
            {(menuCtx.showCreateGroupModal == true) &&
                <CreateNewGroupModal />
            }

            {(menuCtx.showAddFriendModal == true) &&
                <AddFriendModal />
            }

            {(menuCtx.showConfigModal == true) &&
                <UserConfigModal />
            }

            {(menuCtx.showPendingInvitations == true) &&
                <PendingInvitationsModal />
            }

            {(menuCtx.showImageModal == true) &&
                <ImageModal />
            }

            {(menuCtx.showContextMenu == true) &&
                <ContextMenu
                    closeOnClick={true}
                >
                    {menuCtx.contextMenuItems}
                </ContextMenu>
            }

            {(menuCtx.showChatPhotoModal == true) &&
                <ShowChatPhotoModal />
            }

            {(userCtx.token != "") &&
                <div className="h-full flex flex-row bg-gray-200/90 border-solid border border-gray-400/70 shadow-lg">
                    <div className="w-60 flex flex-col min-w-60 overflow-hidden bg-gray-50">
                        <div className="py-4 px-2 flex justify-start border-solid border-b h-[80px] border-gray-500/40">
                            {/*}
                            <Button
                                onClick={handleShowCreateGroupBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Criar grupo"
                            >
                            
                                <BsPlus className="fill-blue-600 w-8 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                                <p className="transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white">Criar grupo</p>
                            </Button>
                            {*/}

                            <Button
                                onClick={handleShowAddFriendBtn}
                                className="!bg-transparent w-full border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Adicionar Amigo"
                            >
                                <BsPersonFillAdd className="fill-blue-600 w-8 h-auto hover:!bg-transparent group-active:fill-white" />
                                <p className="ms-2 transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white">Procurar Amigo</p>
                            </Button>
                        </div>

                        <div className="flex-1 pt-1.5" style={{ maxHeight: "calc(100% - 128px)" }}>
                            <Tabs className="h-full flex flex-col" value="friends">
                                {/* @ts-ignore */}
                                <TabsHeader placeholder={""} className="bg-gray-200 mx-1.5">
                                    {/* @ts-ignore */}
                                    <Tab placeholder="Friends" key={"friends"} value={"friends"}>
                                        Amigos
                                    </Tab>
                                    {/*}
                                    {/* @ts-ignore
                                    <Tab placeholder="Groups" key="groups" value="groups">
                                        Grupos
                                    </Tab>
                                    */}
                                </TabsHeader>
                                
                                {/* @ts-ignore */}
                                <TabsBody className="relative h-full" placeholder="" animate={{
                                    initial: { x: 250 },
                                    mount: { x: 0 },
                                    unmount: { x: 250 }
                                }}>
                                    <TabPanel value="friends" className="h-full max-h-full p-0">
                                        <StyledChatsContainer>
                                            {
                                                chatCtx.friends.map((friend, idx) => {
                                                    return <FriendCard
                                                        key={`${friend.uuid}${friend.nickName}${idx}`}
                                                        idx={idx}
                                                        isSelected={(chatCtx.activeChat?.type == "user" && chatCtx.activeChat.index == idx) ? true : false}
                                                        friend={friend}
                                                        className={`${(chatCtx.activeChat?.type == "user" && chatCtx.activeChat.index == idx) ? "selected" : ""}`}
                                                    />
                                                })
                                            }

                                            {(chatCtx.friends.length == 0) &&
                                                <Paragraph
                                                    className="text-center"
                                                >
                                                    Você não possui nenhum amigo
                                                </Paragraph>
                                            }
                                        </StyledChatsContainer>

                                    </TabPanel>

                                    <TabPanel value="groups" className="flex h-full max-h-fit overflow-hidden p-0">
                                        <StyledChatsContainer>
                                            {
                                                chatCtx.groups.map((group, idx) => {
                                                    return <GroupCard
                                                        key={`${group.uuid}${group.name}${idx}`}
                                                        idx={idx}
                                                        group={group}
                                                        className={`${(chatCtx.activeChat?.type == "group" && chatCtx.activeChat.index == idx) ? "selected" : ""}`}
                                                    />
                                                })
                                            }

                                            {(chatCtx.groups.length == 0) &&
                                                <Paragraph
                                                    className="text-center"
                                                >
                                                    Você não está participando de nenhum grupo
                                                </Paragraph>
                                            }
                                        </StyledChatsContainer>

                                    </TabPanel>
                                </TabsBody>
                            </Tabs>
                        </div>

                        <div className="h-12 flex px-1 justify-start items-center border-t border-solid border-gray-500/40">
                            <Button
                                onClick={handleConfigBtn}
                                className="!bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Configurações"
                            >
                                <BsGearFill className="fill-blue-600 w-5 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                                {/*<p className="transition-all group-hover:!bg-transparent group-hover:!text-slate-800 group-active:!text-white"></p>*/}
                            </Button>

                            <Button
                                onClick={handlePendingInvitationsBtn}
                                className="!ms-auto !bg-transparent border-solid border border-gray-500/40 !duration-100 !text-slate-800 hover:!bg-gray-200 active:!bg-blue-500 group"
                                title="Pedidos de Amizade"
                            >
                                <SlEnvolopeLetter className="fill-blue-600 w-5 h-auto hover:!bg-transparent transition-all group-active:fill-white" />
                            </Button>
                        </div>



                    </div>

                    <div
                        className="relative flex-1 h-full max-w-[100%] flex flex-col border border-solid border-l-gray-400/70"
                        onDragEnter={handleFileDragEnter}
                        onDragLeave={handleFileDragLeave}
                    >

                        {/*}
                        {(showEmojiPicker == true) &&
                            <div className="absolute bottom-12 right-0">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClicked}
                                    emojiStyle={EmojiStyle.APPLE}
                                    theme={Theme.DARK}
                                    lazyLoadEmojis={true}
                                />
                            </div>
                        }
                        */}


                        {/* Modal de input dos arquivos */}
                        {(menuCtx.showFileInput == true && chatCtx.activeChat != null) &&
                            <FileInputModal files={files} setFiles={setFiles} fileInputRef={fileInputRef} />
                        }

                        {(userCtx.user != null && chatCtx.activeChat != null) &&
                            <div>

                            </div>
                        }

                        {/* Container com as mensagens do chat selecionado */}
                        {(userCtx!.user != null && chatCtx.activeChat != null) &&
                            <MessagesContainer />
                        }

                        {/* Arquivos anexados */}
                        {(files.length > 0) &&
                            <div className="w-full h-auto p-1 bg-slate-200 border border-solid border-t-gray-500/40 flex justify-end items-center">
                                {files.map((file, idx) => {
                                    return <AnnexedFile key={idx} file={file} fileIndex={idx} files={files} setFiles={setFiles} />
                                })
                                }
                            </div>
                        }



                        <MsgInput
                            selectedFiles={files}
                            loggedUser={userCtx.user!}
                            clearFiles={handleClearFiles}
                            setSelectedFiles={setFiles}
                        />
                    </div>
                </div>
            }
        </>

    );
}


export default Chat;