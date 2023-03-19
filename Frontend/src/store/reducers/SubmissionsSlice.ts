import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubmission} from "../../models/ISubmission";
import {
    addSubmissions,
    deleteSubmissions,
    fetchAllSubmissions, fetchSubmissionsForStudent,
    updateSubmissions
} from "../../services/SubmissionsService";

interface SubmissionsState {
    submissions: ISubmission[];
    submissionsIsLoading: boolean;
    submissionsError: string;
}

let initialState: SubmissionsState = {
    submissions: [],
    submissionsIsLoading: false,
    submissionsError: '',
}

const sortFunction = (a: ISubmission, b: ISubmission): number => {
    return a.id - b.id;
}

export const submissionsSlice = createSlice({
    name: 'submissions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // fetchAllSubmissions
            .addCase(fetchAllSubmissions.fulfilled, (state: SubmissionsState, action: PayloadAction<ISubmission[]>) => {
                state.submissionsIsLoading = false;
                state.submissionsError = ''
                state.submissions = action.payload;
            })
            .addCase(fetchAllSubmissions.pending, (state: SubmissionsState) => {
                state.submissionsIsLoading = true;
            })
            .addCase(fetchAllSubmissions.rejected, (state: SubmissionsState, action) => {
                state.submissionsIsLoading = false;
                state.submissionsError = action.payload as string;
            })

            // addSubmissions
            .addCase(addSubmissions.fulfilled, (state: SubmissionsState, action: PayloadAction<ISubmission>) => {
                state.submissionsIsLoading = false;
                state.submissionsError = '';
                state.submissions = [...state.submissions, action.payload].sort(sortFunction);
            })
            .addCase(addSubmissions.pending, (state: SubmissionsState) => {
                state.submissionsIsLoading = true;
            })
            .addCase(addSubmissions.rejected, (state: SubmissionsState, action) => {
                state.submissionsIsLoading = false;
                state.submissionsError = action.payload as string;
            })

            // updateSubmissions
            .addCase(updateSubmissions.fulfilled, (state: SubmissionsState, action: PayloadAction<ISubmission>) => {
                state.submissionsIsLoading = false;
                state.submissionsError = '';
                state.submissions = [...state.submissions.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateSubmissions.pending, (state: SubmissionsState) => {
                state.submissionsIsLoading = true;
            })
            .addCase(updateSubmissions.rejected, (state: SubmissionsState, action) => {
                state.submissionsIsLoading = false;
                state.submissionsError = action.payload as string;
            })

            // deleteSubmissions
            .addCase(deleteSubmissions.fulfilled, (state: SubmissionsState, action: PayloadAction<number>) => {
                state.submissionsIsLoading = false;
                state.submissionsError = '';
                state.submissions = state.submissions.filter(x => x.id != action.payload);
            })
            .addCase(deleteSubmissions.pending, (state: SubmissionsState) => {
                state.submissionsIsLoading = true;
            })
            .addCase(deleteSubmissions.rejected, (state: SubmissionsState, action) => {
                state.submissionsIsLoading = false;
                state.submissionsError = action.payload as string;
            })

            // fetchSubmissionsForStudent
            .addCase(fetchSubmissionsForStudent.fulfilled, (state: SubmissionsState, action: PayloadAction<ISubmission[]>) => {
                state.submissionsIsLoading = false;
                state.submissionsError = ''
                state.submissions = action.payload;
            })
            .addCase(fetchSubmissionsForStudent.pending, (state: SubmissionsState) => {
                state.submissionsIsLoading = true;
            })
            .addCase(fetchSubmissionsForStudent.rejected, (state: SubmissionsState, action) => {
                state.submissionsIsLoading = false;
                state.submissionsError = action.payload as string;
            })
    }
});

export default submissionsSlice.reducer;