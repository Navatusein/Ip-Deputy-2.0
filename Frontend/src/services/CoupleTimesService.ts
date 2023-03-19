import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {ICoupleTime} from "../models/ICoupleTime";

export const fetchAllCoupleTimes = createAsyncThunk<ICoupleTime[], undefined, {rejectValue: string}>(
    'coupleTimes/fetchAllCoupleTimes',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<ICoupleTime[]>('/couples');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)