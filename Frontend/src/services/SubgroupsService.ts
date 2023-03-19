import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {IGroup} from "../models/IGroup";
import {ISubgroup} from "../models/ISubgroup";

export const fetchAllSubgroups = createAsyncThunk<ISubgroup[], undefined, {rejectValue: string}>(
    'subgroups/fetchAllSubgroups',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<ISubgroup[]>('/subgroups');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addSubgroup = createAsyncThunk<ISubgroup, ISubgroup, {rejectValue: string}>(
    'subgroups/addSubgroup',
    async (subgroup: ISubgroup, thunkAPI) => {
        try {
            const response = await api.post<ISubgroup>('/subgroups', subgroup);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateSubgroup = createAsyncThunk<ISubgroup, ISubgroup, {rejectValue: string}>(
    'subgroups/updateSubgroup',
    async (subgroup: ISubgroup, thunkAPI) => {
        try {
            const response = await api.put<ISubgroup>('/subgroups', subgroup);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteSubgroup = createAsyncThunk<number, number, {rejectValue: string}>(
    'subgroups/deleteSubgroup',
    async (subgroupId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/subgroups', {params: {id: subgroupId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)