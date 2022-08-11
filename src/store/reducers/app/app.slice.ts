import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

type AppSliceStateType = {
    auth: boolean
}

const initialState: AppSliceStateType = {
    auth: false
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setCookies(state, {payload: {name, value}}: PayloadAction<{name: string, value: any}>) {
            Cookies.set(name, value);
        },
        removeCookies(state, {payload}: PayloadAction<string>) {
            Cookies.remove(payload);
        },
        setAuth(state, {payload}: PayloadAction<boolean>) {
            state.auth = payload
        }
    }
});

export const appSliceActions = appSlice.actions;
export const appReducer = appSlice.reducer;

