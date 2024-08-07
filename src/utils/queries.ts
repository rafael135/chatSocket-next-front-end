import { getGroupMembers, getGroupMessages, getUserMessages, isUserGroupAdmin, searchFriends } from "@/lib/actions";
import { MessageType } from "@/types/Message";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { User, UserFriend } from "@/types/User";


export const useGroupMessages = (groupUuid: string) => {
    const query = useQuery({
        // "online" => Padrão, pausa a requisição caso não haja internet. Faz a requisição ao restaurar internet
        // "always" => Faz a requisição tendo internet ou não. Utilizado geralmente quando a fonte de dados não vem de uma requisição
        networkMode: "online",
        queryKey: ["group", `${groupUuid}`], //{ limit: limit, start: start }],
        queryFn: () => getGroupMessages(groupUuid),
        staleTime: 0, // "staleTime" => Tempo até a requisição estar obsoleta e precisar ser atualizada || "Infinity" => Tempo infinito, não atualiza mais a query
        //enabled, // "enabled" => Permite a execucao da query, padrão: "true"
        //keepPreviousData: true, // "keepPreviousData" => Se true, mantem os dados atuais da query ao fazer uma nova, padrao = false
        //initialData: postsInitialData // "initialData" => Dados iniciais atribuidos antes de ser feito a query, "placeholderData" => Apenas "exibe" dados, nao atribui
        initialData: queryClient.getQueryData(["group", `${groupUuid}`])
    });

    return query;
};

export const useMessages = (uuid: string, type: "group" | "user") => {
    const query = useQuery<MessageType[]>({
        // "online" => Padrão, pausa a requisição caso não haja internet. Faz a requisição ao restaurar internet
        // "always" => Faz a requisição tendo internet ou não. Utilizado geralmente quando a fonte de dados não vem de uma requisição
        networkMode: "online",
        queryKey: [`${((type == "group") ? "group" : "user")}`, `${uuid}`], //{ limit: limit, start: start }],
        queryFn: () => (type == "group") ? getGroupMessages(uuid) : getUserMessages(uuid),
        staleTime: 0, // "staleTime" => Tempo até a requisição estar obsoleta e precisar ser atualizada || "Infinity" => Tempo infinito, não atualiza mais a query
        //enabled, // "enabled" => Permite a execucao da query, padrão: "true"
        //keepPreviousData: true, // "keepPreviousData" => Se true, mantem os dados atuais da query ao fazer uma nova, padrao = false
        //initialData: postsInitialData // "initialData" => Dados iniciais atribuidos antes de ser feito a query, "placeholderData" => Apenas "exibe" dados, nao atribui
        initialData: queryClient.getQueryData([`${(type == "group") ? "group" : "user"}`, `${uuid}`])
    });

    return query;
};

export const useSearchUser = (searchName: string) => {
    const query = useQuery<UserFriend[]>({
        enabled: false,
        networkMode: "online",
        queryKey: ["search", "user", searchName],
        queryFn: () => searchFriends(searchName),
        staleTime: 0
    });

    return query;
}

export const useGroupMembers = (groupUuid: string) => {
    const query = useQuery<User[]>({
        enabled: true,
        networkMode: "online",
        queryKey: ["group", groupUuid, "members"],
        queryFn: () => getGroupMembers(groupUuid),
        staleTime: 0
    });

    return query;
}


export const useIsUserAdmin = (groupUuid: string, userUuid: string) => {
    const query = useQuery<boolean>({
        enabled: true,
        networkMode: "online",
        queryKey: ["groupAdmin", groupUuid, userUuid],
        queryFn: () => isUserGroupAdmin(groupUuid, userUuid),
        staleTime: Infinity
    });

    return query;
}

/*
export const useUserInfo = (userUuid: string) => {
    const query = useQuery<User>({
        enabled: true,
        networkMode: "online",
        queryKey: ["user", userUuid],
        queryFn: () => 
    })
}
*/