import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IGroup} from "../../models/IGroup";
import {addGroup, deleteGroup, fetchAllGroups, updateGroup} from "../../services/GroupsService";

interface GroupsState {
    groups: IGroup[];
    groupsIsLoading: boolean;
    groupsError: string;
}

let initialState: GroupsState = {
    groups: [],
    groupsIsLoading: false,
    groupsError: '',
}

const sortFunction = (a: IGroup, b: IGroup): number => {
    return a.name.localeCompare(b.name);
}

export const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchAllGroups
            .addCase(fetchAllGroups.fulfilled, (state: GroupsState, action: PayloadAction<IGroup[]>) => {
                state.groupsIsLoading = false;
                state.groupsError = ''
                state.groups = action.payload;
            })
            .addCase(fetchAllGroups.pending, (state: GroupsState) => {
                state.groupsIsLoading = true;
            })
            .addCase(fetchAllGroups.rejected, (state: GroupsState, action) => {
                state.groupsIsLoading = false;
                state.groupsError = action.payload as string;
            })

            // addGroup
            .addCase(addGroup.fulfilled, (state: GroupsState, action: PayloadAction<IGroup>) => {
                state.groupsIsLoading = false;
                state.groupsError = '';
                state.groups = [...state.groups, action.payload].sort(sortFunction);
            })
            .addCase(addGroup.pending, (state: GroupsState) => {
                state.groupsIsLoading = true;
            })
            .addCase(addGroup.rejected, (state: GroupsState, action) => {
                state.groupsIsLoading = false;
                state.groupsError = action.payload as string;
            })

            // updateGroup
            .addCase(updateGroup.fulfilled, (state: GroupsState, action: PayloadAction<IGroup>) => {
                state.groupsIsLoading = false;
                state.groupsError = '';
                state.groups = [...state.groups.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateGroup.pending, (state: GroupsState) => {
                state.groupsIsLoading = true;
            })
            .addCase(updateGroup.rejected, (state: GroupsState, action) => {
                state.groupsIsLoading = false;
                state.groupsError = action.payload as string;
            })

            // deleteGroup
            .addCase(deleteGroup.fulfilled, (state: GroupsState, action: PayloadAction<number>) => {
                state.groupsIsLoading = false;
                state.groupsError = '';
                state.groups = state.groups.filter(x => x.id != action.payload);
            })
            .addCase(deleteGroup.pending, (state: GroupsState) => {
                state.groupsIsLoading = true;
            })
            .addCase(deleteGroup.rejected, (state: GroupsState, action) => {
                state.groupsIsLoading = false;
                state.groupsError = action.payload as string;
            })
    }
});

export default groupsSlice.reducer;