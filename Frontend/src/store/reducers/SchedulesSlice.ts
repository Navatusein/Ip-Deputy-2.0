import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ISchedule} from "../../models/ISchedule";
import {addSchedule, deleteSchedule, fetchScheduleByDayOfWeek, updateSchedule} from "../../services/SchedulesService";

interface SchedulesState {
    schedules: ISchedule[];
    schedulesIsLoading: boolean;
    schedulesError: string;
}

let initialState: SchedulesState = {
    schedules: [],
    schedulesIsLoading: false,
    schedulesError: '',
}

const sortFunction = (a: ISchedule, b: ISchedule): number => {
    return a.id - b.id;
}

export const scheduleSlice = createSlice({
    name: 'schedules',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchScheduleByDayOfWeek
            .addCase(fetchScheduleByDayOfWeek.fulfilled, (state: SchedulesState, action: PayloadAction<ISchedule[]>) => {
                state.schedulesIsLoading = false;
                state.schedulesError = ''
                state.schedules = action.payload;
            })
            .addCase(fetchScheduleByDayOfWeek.pending, (state: SchedulesState) => {
                state.schedulesIsLoading = true;
            })
            .addCase(fetchScheduleByDayOfWeek.rejected, (state: SchedulesState, action) => {
                state.schedulesIsLoading = false;
                state.schedulesError = action.payload as string;
            })

            // addSchedule
            .addCase(addSchedule.fulfilled, (state: SchedulesState, action: PayloadAction<ISchedule>) => {
                state.schedulesIsLoading = false;
                state.schedulesError = '';
                state.schedules = [...state.schedules, action.payload].sort(sortFunction);
            })
            .addCase(addSchedule.pending, (state: SchedulesState) => {
                state.schedulesIsLoading = true;
            })
            .addCase(addSchedule.rejected, (state: SchedulesState, action) => {
                state.schedulesIsLoading = false;
                state.schedulesError = action.payload as string;
            })

            // updateSchedule
            .addCase(updateSchedule.fulfilled, (state: SchedulesState, action: PayloadAction<ISchedule>) => {
                state.schedulesIsLoading = false;
                state.schedulesError = '';
                state.schedules = [...state.schedules.filter(x => x.id != action.payload.id), action.payload].sort(sortFunction);
            })
            .addCase(updateSchedule.pending, (state: SchedulesState) => {
                state.schedulesIsLoading = true;
            })
            .addCase(updateSchedule.rejected, (state: SchedulesState, action) => {
                state.schedulesIsLoading = false;
                state.schedulesError = action.payload as string;
            })

            // deleteSchedule
            .addCase(deleteSchedule.fulfilled, (state: SchedulesState, action: PayloadAction<number>) => {
                state.schedulesIsLoading = false;
                state.schedulesError = '';
                state.schedules = state.schedules.filter(x => x.id != action.payload);
            })
            .addCase(deleteSchedule.pending, (state: SchedulesState) => {
                state.schedulesIsLoading = true;
            })
            .addCase(deleteSchedule.rejected, (state: SchedulesState, action) => {
                state.schedulesIsLoading = false;
                state.schedulesError = action.payload as string;
            })
    }
});

export default scheduleSlice.reducer;