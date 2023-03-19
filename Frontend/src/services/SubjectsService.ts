import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {ISubject} from "../models/ISubject";

export const fetchAllSubjects = createAsyncThunk<ISubject[], undefined, {rejectValue: string}>(
    'subjects/fetchAllGroups',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<ISubject[]>('/subjects');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addSubject = createAsyncThunk<ISubject, ISubject, {rejectValue: string}>(
    'subjects/addSubject',
    async (subject: ISubject, thunkAPI) => {
        try {
            const response = await api.post<ISubject>('/subjects', subject);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateSubject = createAsyncThunk<ISubject, ISubject, {rejectValue: string}>(
    'subjects/updateSubject',
    async (subject: ISubject, thunkAPI) => {
        try {
            const response = await api.put<ISubject>('/subjects', subject);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteSubject = createAsyncThunk<number, number, {rejectValue: string}>(
    'subjects/deleteSubject',
    async (subjectId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/subjects', {params: {id: subjectId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)