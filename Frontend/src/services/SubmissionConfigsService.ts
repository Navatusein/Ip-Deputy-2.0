import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {ISubmissionConfig} from "../models/ISubmissionConfig";

export const fetchAllSubmissionConfigs = createAsyncThunk<ISubmissionConfig[], undefined, {rejectValue: string}>(
    'submissionConfigs/fetchAllSubmissionConfigs',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<ISubmissionConfig[]>('/submission-config');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addSubmissionConfigs = createAsyncThunk<ISubmissionConfig, ISubmissionConfig, {rejectValue: string}>(
    'submissionConfigs/addSubmissionConfigs',
    async (submissionConfig: ISubmissionConfig, thunkAPI) => {
        try {
            const response = await api.post<ISubmissionConfig>('/submission-config', submissionConfig);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateSubmissionConfigs = createAsyncThunk<ISubmissionConfig, ISubmissionConfig, {rejectValue: string}>(
    'submissionConfigs/updateSubmissionConfigs',
    async (submissionConfig: ISubmissionConfig, thunkAPI) => {
        try {
            const response = await api.put<ISubmissionConfig>('/submission-config', submissionConfig);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteSubmissionConfigs = createAsyncThunk<number, number, {rejectValue: string}>(
    'submissionConfigs/deleteSubmissionConfigs',
    async (submissionConfigId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/submission-config', {params: {id: submissionConfigId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const fetchSubmissionConfigsForStudent = createAsyncThunk<ISubmissionConfig[], number, {rejectValue: string}>(
    'submissionConfigs/fetchSubmissionConfigsForStudent',
    async (studentId: number, thunkAPI) => {
        try {
            const response = await api.get<ISubmissionConfig[]>('/submission-config/for-student', {params: {studentId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)