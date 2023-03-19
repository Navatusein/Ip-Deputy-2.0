import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {ITeacher} from "../models/ITeacher";

export const fetchAllTeachers = createAsyncThunk<ITeacher[], undefined, {rejectValue: string}>(
    'groups/fetchAllTeachers',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<ITeacher[]>('/teachers');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addTeacher = createAsyncThunk<ITeacher, ITeacher, {rejectValue: string}>(
    'groups/addTeachers',
    async (teacher: ITeacher, thunkAPI) => {
        try {
            const response = await api.post<ITeacher>('/teachers', teacher);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateTeacher = createAsyncThunk<ITeacher, ITeacher, {rejectValue: string}>(
    'groups/updateTeachers',
    async (teacher: ITeacher, thunkAPI) => {
        try {
            const response = await api.put<ITeacher>('/teachers', teacher);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteTeacher = createAsyncThunk<number, number, {rejectValue: string}>(
    'groups/deleteTeachers',
    async (teacherId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/teachers', {params: {id: teacherId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)