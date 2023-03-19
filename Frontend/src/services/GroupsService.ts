import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {IGroup} from "../models/IGroup";

export const fetchAllGroups = createAsyncThunk<IGroup[], undefined, {rejectValue: string}>(
    'groups/fetchAllGroups',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<IGroup[]>('/groups');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addGroup = createAsyncThunk<IGroup, IGroup, {rejectValue: string}>(
    'groups/addGroup',
    async (group: IGroup, thunkAPI) => {
        try {
            const response = await api.post<IGroup>('/groups', group);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateGroup = createAsyncThunk<IGroup, IGroup, {rejectValue: string}>(
    'groups/updateGroup',
    async (group: IGroup, thunkAPI) => {
        try {
            const response = await api.put<IGroup>('/groups', group);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteGroup = createAsyncThunk<number, number, {rejectValue: string}>(
    'groups/deleteGroup',
    async (groupId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/groups', {params: {id: groupId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)