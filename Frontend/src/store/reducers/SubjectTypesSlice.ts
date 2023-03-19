import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubjectType} from "../../models/ISubjectType";
import {fetchAllSubjectTypes} from "../../services/SubjectTypesService";

interface SubjectTypesState {
    subjectTypes: ISubjectType[];
    subjectTypesIsLoading: boolean;
    subjectTypesError: string;
}

let initialState: SubjectTypesState = {
    subjectTypes: [],
    subjectTypesIsLoading: false,
    subjectTypesError: '',
}

export const subjectTypesSlice = createSlice({
    name: 'subjectTypes',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchAllSubjectTypes
            .addCase(fetchAllSubjectTypes.fulfilled, (state: SubjectTypesState, action: PayloadAction<ISubjectType[]>) => {
                state.subjectTypesIsLoading = false;
                state.subjectTypesError = ''
                state.subjectTypes = action.payload;
            })
            .addCase(fetchAllSubjectTypes.pending, (state: SubjectTypesState) => {
                state.subjectTypesIsLoading = true;
            })
            .addCase(fetchAllSubjectTypes.rejected, (state: SubjectTypesState, action) => {
                state.subjectTypesIsLoading = false;
                state.subjectTypesError = action.payload as string;
            })
    }
});

export default subjectTypesSlice.reducer;