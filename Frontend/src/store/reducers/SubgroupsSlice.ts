import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubgroup} from "../../models/ISubgroup";
import {addSubgroup, deleteSubgroup, fetchAllSubgroups, updateSubgroup} from "../../services/SubgroupsService";

interface SubgroupsState {
    subgroups: ISubgroup[];
    subgroupsIsLoading: boolean;
    subgroupsError: string;
}

let initialState: SubgroupsState = {
    subgroups: [],
    subgroupsIsLoading: false,
    subgroupsError: '',
}

const sortFunction = (a: ISubgroup, b: ISubgroup): number => {
    return a.id - b.id;
}

export const subgroupsSlice = createSlice({
    name: 'subgroups',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchAllSubgroups
            .addCase(fetchAllSubgroups.fulfilled, (state: SubgroupsState, action: PayloadAction<ISubgroup[]>) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = ''
                state.subgroups = action.payload;
            })
            .addCase(fetchAllSubgroups.pending, (state: SubgroupsState) => {
                state.subgroupsIsLoading = true;
            })
            .addCase(fetchAllSubgroups.rejected, (state: SubgroupsState, action) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = action.payload as string;
            })

            // addSubgroup
            .addCase(addSubgroup.fulfilled, (state: SubgroupsState, action: PayloadAction<ISubgroup>) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = '';
                state.subgroups = [...state.subgroups, action.payload].sort(sortFunction);
            })
            .addCase(addSubgroup.pending, (state: SubgroupsState) => {
                state.subgroupsIsLoading = true;
            })
            .addCase(addSubgroup.rejected, (state: SubgroupsState, action) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = action.payload as string;
            })

            // updateSubgroup
            .addCase(updateSubgroup.fulfilled, (state: SubgroupsState, action: PayloadAction<ISubgroup>) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = '';
                state.subgroups = [...state.subgroups.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateSubgroup.pending, (state: SubgroupsState) => {
                state.subgroupsIsLoading = true;
            })
            .addCase(updateSubgroup.rejected, (state: SubgroupsState, action) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = action.payload as string;
            })

            // deleteSubgroup
            .addCase(deleteSubgroup.fulfilled, (state: SubgroupsState, action: PayloadAction<number>) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = '';
                state.subgroups = state.subgroups.filter(x => x.id != action.payload);
            })
            .addCase(deleteSubgroup.pending, (state: SubgroupsState) => {
                state.subgroupsIsLoading = true;
            })
            .addCase(deleteSubgroup.rejected, (state: SubgroupsState, action) => {
                state.subgroupsIsLoading = false;
                state.subgroupsError = action.payload as string;
            })
    }
});

export default subgroupsSlice.reducer;