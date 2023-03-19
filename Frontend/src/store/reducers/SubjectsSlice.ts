import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISubject} from "../../models/ISubject";
import {addSubject, deleteSubject, fetchAllSubjects, updateSubject} from "../../services/SubjectsService";

interface SubjectsState {
    subjects: ISubject[];
    subjectsIsLoading: boolean;
    subjectsError: string;
}

let initialState: SubjectsState = {
    subjects: [],
    subjectsIsLoading: false,
    subjectsError: '',
}

const sortFunction = (a: ISubject, b: ISubject): number => {
    return a.name.localeCompare(b.name);
}

export const subjectsSlice = createSlice({
    name: 'subjects',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchAllSubjects
            .addCase(fetchAllSubjects.fulfilled, (state: SubjectsState, action: PayloadAction<ISubject[]>) => {
                state.subjectsIsLoading = false;
                state.subjectsError = ''
                state.subjects = action.payload;
            })
            .addCase(fetchAllSubjects.pending, (state: SubjectsState) => {
                state.subjectsIsLoading = true;
            })
            .addCase(fetchAllSubjects.rejected, (state: SubjectsState, action) => {
                state.subjectsIsLoading = false;
                state.subjectsError = action.payload as string;
            })

            // addSubjects
            .addCase(addSubject.fulfilled, (state: SubjectsState, action: PayloadAction<ISubject>) => {
                state.subjectsIsLoading = false;
                state.subjectsError = '';
                state.subjects = [...state.subjects, action.payload].sort(sortFunction);
            })
            .addCase(addSubject.pending, (state: SubjectsState) => {
                state.subjectsIsLoading = true;
            })
            .addCase(addSubject.rejected, (state: SubjectsState, action) => {
                state.subjectsIsLoading = false;
                state.subjectsError = action.payload as string;
            })

            // updateStudent
            .addCase(updateSubject.fulfilled, (state: SubjectsState, action: PayloadAction<ISubject>) => {
                state.subjectsIsLoading = false;
                state.subjectsError = '';
                state.subjects = [...state.subjects.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateSubject.pending, (state: SubjectsState) => {
                state.subjectsIsLoading = true;
            })
            .addCase(updateSubject.rejected, (state: SubjectsState, action) => {
                state.subjectsIsLoading = false;
                state.subjectsError = action.payload as string;
            })

            // deleteStudent
            .addCase(deleteSubject.fulfilled, (state: SubjectsState, action: PayloadAction<number>) => {
                state.subjectsIsLoading = false;
                state.subjectsError = '';
                state.subjects = state.subjects.filter(x => x.id != action.payload);
            })
            .addCase(deleteSubject.pending, (state: SubjectsState) => {
                state.subjectsIsLoading = true;
            })
            .addCase(deleteSubject.rejected, (state: SubjectsState, action) => {
                state.subjectsIsLoading = false;
                state.subjectsError = action.payload as string;
            })
    }
});

export default subjectsSlice.reducer;