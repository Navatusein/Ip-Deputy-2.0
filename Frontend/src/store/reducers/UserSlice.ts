import {IUser} from "../../models/IUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loginUser} from "../../services/UserService";

interface UserState {
    user: IUser | null;
    userIsLoading: boolean;
    userError: string;
}

let initialState: UserState = {
    user: null,
    userIsLoading: false,
    userError: '',
}

if (localStorage.getItem('user'))
    initialState.user = JSON.parse(localStorage.getItem('user')!);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout(state) {
            localStorage.removeItem('user')
            state.user = null;
        },
        setUser(state, action: PayloadAction<IUser | null>) {
            state.userIsLoading = false;
            state.userError = ''
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder

            // loginUser
            .addCase(loginUser.fulfilled, (state: UserState, action: PayloadAction<IUser>) => {
                state.userIsLoading = false;
                state.userError = ''
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(loginUser.pending, (state: UserState) => {
                state.userIsLoading = true;
            })
            .addCase(loginUser.rejected, (state: UserState, action) => {
                state.userIsLoading = false;
                state.userError = action.payload as string;
            })
    }
});

export default userSlice.reducer;