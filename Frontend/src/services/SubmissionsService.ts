import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {ISubmission} from "../models/ISubmission";

export const fetchAllSubmissions = createAsyncThunk<ISubmission[], undefined, {rejectValue: string}>(
    'submissions/fetchAllSubmissions',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<ISubmission[]>('/submissions');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addSubmissions = createAsyncThunk<ISubmission, ISubmission, {rejectValue: string}>(
    'submissions/addSubmissions',
    async (submission: ISubmission, thunkAPI) => {
        try {
            const response = await api.post<ISubmission>('/submissions', submission);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateSubmissions = createAsyncThunk<ISubmission, ISubmission, {rejectValue: string}>(
    'submissions/updateSubmissions',
    async (submission: ISubmission, thunkAPI) => {
        try {
            const response = await api.put<ISubmission>('/submissions', submission);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteSubmissions = createAsyncThunk<number, number, {rejectValue: string}>(
    'submissions/deleteSubmissions',
    async (submissionId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/submissions', {params: {id: submissionId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const fetchSubmissionsForStudent = createAsyncThunk<ISubmission[], number, {rejectValue: string}>(
    'submissions/fetchSubmissionsForStudent',
    async (studentId: number, thunkAPI) => {
        try {
            const response = await api.get<ISubmission[]>('/submissions/for-student', {params: {studentId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)