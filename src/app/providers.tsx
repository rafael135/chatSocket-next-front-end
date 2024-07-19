import { QueryProvider } from "@/utils/queryProvider";
import { ChatContextProvider } from "@/contexts/ChatContext";
import { MenuContextProvider } from "@/contexts/MenuContext";
import { MessagesProvider } from "@/contexts/MessagesContext";
import { SocketContextProvider } from "@/contexts/SocketContext";
import { UserProvider } from "@/contexts/UserContext";
import { ReactNode } from "react";


const Providers = ({ children }: { children: ReactNode }) => {


    return (
        <UserProvider>
            {/*<ProtectRoute>*/}
            <SocketContextProvider>

                <MessagesProvider>
                    <ChatContextProvider>
                        <QueryProvider>
                            <MenuContextProvider>
                                {children}
                            </MenuContextProvider>
                        </QueryProvider>
                    </ChatContextProvider>
                </MessagesProvider>

            </SocketContextProvider>
            {/*</ProtectRoute>*/}
        </UserProvider>
    );
}

export default Providers;