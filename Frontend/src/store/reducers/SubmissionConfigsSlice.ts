import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubmissionConfig} from "../../models/ISubmissionConfig";
import {
    addSubmissionConfigs, deleteSubmissionConfigs,
    fetchAllSubmissionConfigs, fetchSubmissionConfigsForStudent,
    updateSubmissionConfigs
} from "../../services/SubmissionConfigsService";

interface SubmissionConfigsState {
    submissionConfigs: ISubmissionConfig[];
    submissionConfigsIsLoading: boolean;
    submissionConfigsError: string;
}

let initialState: SubmissionConfigsState = {
    submissionConfigs: [],
    submissionConfigsIsLoading: false,
    submissionConfigsError: '',
}

const sortFunction = (a: ISubmissionConfig, b: ISubmissionConfig): number => {
    return a.id - b.id;
}

export const submissionConfigsSlice = createSlice({
    name: 'submissionConfigs',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchAllSubmissionConfigs
            .addCase(fetchAllSubmissionConfigs.fulfilled, (state: SubmissionConfigsState, action: PayloadAction<ISubmissionConfig[]>) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = ''
                state.submissionConfigs = action.payload;
            })
            .addCase(fetchAllSubmissionConfigs.pending, (state: SubmissionConfigsState) => {
                state.submissionConfigsIsLoading = true;
            })
            .addCase(fetchAllSubmissionConfigs.rejected, (state: SubmissionConfigsState, action) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = action.payload as string;
            })

            // addSubmissionConfigs
            .addCase(addSubmissionConfigs.fulfilled, (state: SubmissionConfigsState, action: PayloadAction<ISubmissionConfig>) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = '';
                state.submissionConfigs = [...state.submissionConfigs, action.payload].sort(sortFunction);
            })
            .addCase(addSubmissionConfigs.pending, (state: SubmissionConfigsState) => {
                state.submissionConfigsIsLoading = true;
            })
            .addCase(addSubmissionConfigs.rejected, (state: SubmissionConfigsState, action) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = action.payload as string;
            })

            // updateSubmissionConfigs
            .addCase(updateSubmissionConfigs.fulfilled, (state: SubmissionConfigsState, action: PayloadAction<ISubmissionConfig>) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = '';
                state.submissionConfigs = [...state.submissionConfigs.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateSubmissionConfigs.pending, (state: SubmissionConfigsState) => {
                state.submissionConfigsIsLoading = true;
            })
            .addCase(updateSubmissionConfigs.rejected, (state: SubmissionConfigsState, action) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = action.payload as string;
            })

            // deleteSubmissionConfigs
            .addCase(deleteSubmissionConfigs.fulfilled, (state: SubmissionConfigsState, action: PayloadAction<number>) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = '';
                state.submissionConfigs = state.submissionConfigs.filter(x => x.id != action.payload);
            })
            .addCase(deleteSubmissionConfigs.pending, (state: SubmissionConfigsState) => {
                state.submissionConfigsIsLoading = true;
            })
            .addCase(deleteSubmissionConfigs.rejected, (state: SubmissionConfigsState, action) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = action.payload as string;
            })

            // fetchSubmissionConfigsForStudent
            .addCase(fetchSubmissionConfigsForStudent.fulfilled, (state: SubmissionConfigsState, action: PayloadAction<ISubmissionConfig[]>) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = ''
                state.submissionConfigs = action.payload;
            })
            .addCase(fetchSubmissionConfigsForStudent.pending, (state: SubmissionConfigsState) => {
                state.submissionConfigsIsLoading = true;
            })
            .addCase(fetchSubmissionConfigsForStudent.rejected, (state: SubmissionConfigsState, action) => {
                state.submissionConfigsIsLoading = false;
                state.submissionConfigsError = action.payload as string;
            })
    }
});

export default submissionConfigsSlice.reducer;