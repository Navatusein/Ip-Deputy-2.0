import {IStudent} from "../models/IStudent";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";

export const fetchStudentsByGroup = createAsyncThunk<IStudent[], number, {rejectValue: string}>(
    'students/fetchStudentsByGroup',
    async (groupId: number, thunkAPI) => {
        try {
            const response = await api.get<IStudent[]>('/students', {params: {groupId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addStudent = createAsyncThunk<IStudent, IStudent, {rejectValue: string}>(
    'students/addStudent',
    async (student: IStudent, thunkAPI) => {
        try {
            const response = await api.post<IStudent>('/students', student);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateStudent = createAsyncThunk<IStudent, IStudent, {rejectValue: string}>(
    'students/updateStudent',
    async (student: IStudent, thunkAPI) => {
        try {
            const response = await api.put<IStudent>('/students', student);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteStudent = createAsyncThunk<number, number, {rejectValue: string}>(
    'students/deleteStudent',
    async (studentId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/students', {params: {id: studentId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)