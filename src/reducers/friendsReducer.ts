import { UserFriendAction } from "@/types/Reducer";
import { UserFriend } from "@/types/User";

export default function friendsReducer(friends: UserFriend[], action: UserFriendAction) {
    switch(action.type) {
        case "add":
            return [...friends, action.friend!]

        case "del":
            return [...friends.filter(fr => fr.uuid != action.friend!.uuid)];

        case "initialize":
            return [...action.initialState!];
    }
}