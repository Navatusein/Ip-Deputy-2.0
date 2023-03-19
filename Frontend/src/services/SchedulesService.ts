import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {ISchedule} from "../models/ISchedule";

export const fetchScheduleByDayOfWeek = createAsyncThunk<ISchedule[], number, {rejectValue: string}>(
    'schedules/fetchScheduleByDayOfWeek',
    async (dayOfWeek: number, thunkAPI) => {
        try {
            const response = await api.get<ISchedule[]>('/schedules', {params: {dayOfWeekId: dayOfWeek}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const addSchedule = createAsyncThunk<ISchedule, ISchedule, {rejectValue: string}>(
    'schedules/addSchedule',
    async (schedule: ISchedule, thunkAPI) => {
        try {
            const response = await api.post<ISchedule>('/schedules', schedule);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const updateSchedule = createAsyncThunk<ISchedule, ISchedule, {rejectValue: string}>(
    'schedules/updateSchedule',
    async (schedule: ISchedule, thunkAPI) => {
        try {
            const response = await api.put<ISchedule>('/schedules', schedule);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)

export const deleteSchedule = createAsyncThunk<number, number, {rejectValue: string}>(
    'schedules/deleteSchedule',
    async (scheduleId: number, thunkAPI) => {
        try {
            const response = await api.delete<number>('/schedules', {params: {id: scheduleId}});
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)