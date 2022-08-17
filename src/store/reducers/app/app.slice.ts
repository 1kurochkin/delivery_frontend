import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

type AppSliceStateType = {
    auth: boolean
}

const initialState: AppSliceStateType = {
    auth: !!Cookies.get('sid') || false
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setAuth(state, {payload}: PayloadAction<boolean>) {
            state.auth = payload
        }
    }
});

export const appSliceActions = appSlice.actions;
export const appReducer = appSlice.reducer;

