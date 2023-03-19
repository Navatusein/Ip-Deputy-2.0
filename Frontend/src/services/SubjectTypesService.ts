import {createAsyncThunk} from "@reduxjs/toolkit";
import api from "../http";

import {ISubjectType} from "../models/ISubjectType";

export const fetchAllSubjectTypes = createAsyncThunk<ISubjectType[], undefined, {rejectValue: string}>(
    'subjectTypes/fetchAllSubjectTypes',
    async (_, thunkAPI) => {
        try {
            const response = await api.get<ISubjectType[]>('/subject-types');
            return response.data;
        }
        catch (e: any) {
            console.error(e);
            return thunkAPI.rejectWithValue(e.message);
        }
    }
)