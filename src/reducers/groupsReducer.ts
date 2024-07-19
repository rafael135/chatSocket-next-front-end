import { Group } from "@/types/Group";
import { UserGroupAction } from "@/types/Reducer";


export const groupsReducer = (groups: Group[], action: UserGroupAction) => {
    switch(action.type) {
        case "add":
            return [...groups, action.group!];

        case "del":
            return [...groups.filter(gr => gr.uuid != action.group!.uuid)];

        case "initialize":
            return [...action.initialState!];
    }
}