import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IStudent} from "../../models/IStudent";
import {addStudent, deleteStudent, fetchStudentsByGroup, updateStudent} from "../../services/StudentsService";

interface StudentsState {
    students: IStudent[];
    studentsIsLoading: boolean;
    studentsError: string;
}

const initialState: StudentsState = {
    students: [],
    studentsIsLoading: false,
    studentsError: '',
}

const sortFunction = (a: IStudent, b: IStudent): number => {
    return a.index - b.index;
}

export const studentsSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        clear(state) {
            state.students = [];
            state.studentsIsLoading = false;
            state.studentsError = ''
        },
    },
    extraReducers: (builder) => {
        builder

            // fetchStudentsByGroup
            .addCase(fetchStudentsByGroup.fulfilled, (state: StudentsState, action: PayloadAction<IStudent[]>) => {
                state.studentsIsLoading = false;
                state.studentsError = ''
                state.students = action.payload;
            })
            .addCase(fetchStudentsByGroup.pending, (state: StudentsState) => {
                state.studentsIsLoading = true;
            })
            .addCase(fetchStudentsByGroup.rejected, (state: StudentsState, action) => {
                state.studentsIsLoading = false;
                state.studentsError = action.payload as string;
            })

            // addStudent
            .addCase(addStudent.fulfilled, (state: StudentsState, action: PayloadAction<IStudent>) => {
                state.studentsIsLoading = false;
                state.studentsError = '';
                state.students = [...state.students, action.payload].sort(sortFunction);
            })
            .addCase(addStudent.pending, (state: StudentsState) => {
                state.studentsIsLoading = true;
            })
            .addCase(addStudent.rejected, (state: StudentsState, action) => {
                state.studentsIsLoading = false;
                state.studentsError = action.payload as string;
            })

            // updateStudent
            .addCase(updateStudent.fulfilled, (state: StudentsState, action: PayloadAction<IStudent>) => {
                state.studentsIsLoading = false;
                state.studentsError = '';
                state.students = [...state.students.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateStudent.pending, (state: StudentsState) => {
                state.studentsIsLoading = true;
            })
            .addCase(updateStudent.rejected, (state: StudentsState, action) => {
                state.studentsIsLoading = false;
                state.studentsError = action.payload as string;
            })

            // deleteStudent
            .addCase(deleteStudent.fulfilled, (state: StudentsState, action: PayloadAction<number>) => {
                state.studentsIsLoading = false;
                state.studentsError = '';
                state.students = state.students.filter(x => x.id != action.payload);
            })
            .addCase(deleteStudent.pending, (state: StudentsState) => {
                state.studentsIsLoading = true;
            })
            .addCase(deleteStudent.rejected, (state: StudentsState, action) => {
                state.studentsIsLoading = false;
                state.studentsError = action.payload as string;
            })
    }
});

export default studentsSlice.reducer;