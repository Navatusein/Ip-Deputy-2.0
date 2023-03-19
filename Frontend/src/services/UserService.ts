import {IUser} from "../models/IUser";
import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";
import {ILoginData} from "../models/ILoginData";

export const loginUser = createAsyncThunk<IUser, ILoginData, {rejectValue: string}>(
    'user/login',
    async (loginData:ILoginData, thunkAPI) => {
        try {
            const response = await api.post<IUser>('/authentication/login', loginData);
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)
