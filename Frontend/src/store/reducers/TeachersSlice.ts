import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ITeacher} from "../../models/ITeacher";
import {addTeacher, fetchAllTeachers, updateTeacher, deleteTeacher} from "../../services/TeachersService";

interface TeachersState {
    teachers: ITeacher[];
    teachersIsLoading: boolean;
    teachersError: string;
}

let initialState: TeachersState = {
    teachers: [],
    teachersIsLoading: false,
    teachersError: '',
}

const sortFunction = (a: ITeacher, b: ITeacher): number => {
    return a.surname.localeCompare(b.surname);
}

export const teachersSlice = createSlice({
    name: 'teachers',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchAllTeachers
            .addCase(fetchAllTeachers.fulfilled, (state: TeachersState, action: PayloadAction<ITeacher[]>) => {
                state.teachersIsLoading = false;
                state.teachersError = ''
                state.teachers = action.payload;
            })
            .addCase(fetchAllTeachers.pending, (state: TeachersState) => {
                state.teachersIsLoading = true;
            })
            .addCase(fetchAllTeachers.rejected, (state: TeachersState, action) => {
                state.teachersIsLoading = false;
                state.teachersError = action.payload as string;
            })

            // addTeacher
            .addCase(addTeacher.fulfilled, (state: TeachersState, action: PayloadAction<ITeacher>) => {
                state.teachersIsLoading = false;
                state.teachersError = '';
                state.teachers = [...state.teachers, action.payload].sort(sortFunction);
            })
            .addCase(addTeacher.pending, (state: TeachersState) => {
                state.teachersIsLoading = true;
            })
            .addCase(addTeacher.rejected, (state: TeachersState, action) => {
                state.teachersIsLoading = false;
                state.teachersError = action.payload as string;
            })

            // updateTeacher
            .addCase(updateTeacher.fulfilled, (state: TeachersState, action: PayloadAction<ITeacher>) => {
                state.teachersIsLoading = false;
                state.teachersError = '';
                state.teachers = [...state.teachers.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateTeacher.pending, (state: TeachersState) => {
                state.teachersIsLoading = true;
            })
            .addCase(updateTeacher.rejected, (state: TeachersState, action) => {
                state.teachersIsLoading = false;
                state.teachersError = action.payload as string;
            })

            // deleteTeacher
            .addCase(deleteTeacher.fulfilled, (state: TeachersState, action: PayloadAction<number>) => {
                state.teachersIsLoading = false;
                state.teachersError = '';
                state.teachers = state.teachers.filter(x => x.id != action.payload);
            })
            .addCase(deleteTeacher.pending, (state: TeachersState) => {
                state.teachersIsLoading = true;
            })
            .addCase(deleteTeacher.rejected, (state: TeachersState, action) => {
                state.teachersIsLoading = false;
                state.teachersError = action.payload as string;
            })
    }
});

export default teachersSlice.reducer;