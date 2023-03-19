import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchAllCoupleTimes} from "../../services/CoupleTimesService";
import {ICoupleTime} from "../../models/ICoupleTime";

interface CoupleTimesState {
    coupleTimes: ICoupleTime[];
    coupleTimesIsLoading: boolean;
    coupleTimesError: string;
}

let initialState: CoupleTimesState = {
    coupleTimes: [],
    coupleTimesIsLoading: false,
    coupleTimesError: '',
}

export const coupleTimesSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            // fetchAllCoupleTimes
            .addCase(fetchAllCoupleTimes.fulfilled, (state: CoupleTimesState, action: PayloadAction<ICoupleTime[]>) => {
                state.coupleTimesIsLoading = false;
                state.coupleTimesError = ''
                state.coupleTimes = action.payload;
            })
            .addCase(fetchAllCoupleTimes.pending, (state: CoupleTimesState) => {
                state.coupleTimesIsLoading = true;
            })
            .addCase(fetchAllCoupleTimes.rejected, (state: CoupleTimesState, action) => {
                state.coupleTimesIsLoading = false;
                state.coupleTimesError = action.payload as string;
            })
    }
});

export default coupleTimesSlice.reducer;