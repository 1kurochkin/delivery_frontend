import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

type AppSliceStateType = {
    auth: boolean;
    loading: boolean;
}

const initialState: AppSliceStateType = {
    auth: !!Cookies.get('sid'),
    loading: false,
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setAuth(state, {payload}: PayloadAction<boolean>) {
            state.auth = payload
        },
        setLoading(state, {payload}: PayloadAction<boolean>) {
            state.loading = payload;
        }
    }
});

export const appSliceActions = appSlice.actions;
export const appReducer = appSlice.reducer;

