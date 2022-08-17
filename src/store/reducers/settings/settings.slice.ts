import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserRoleEnum} from "../backend/backend.api.types";

type SettingsSliceStateType = {
    id: string | undefined;
    role: UserRoleEnum | '';
    phone: string | undefined;
    name: string | undefined;
    wallet?: {
        courier_id: string;
        value: number;
    }
}

const initialState: SettingsSliceStateType = {
    id: undefined,
    role: (localStorage.getItem('role') || '') as (UserRoleEnum | ''),
    phone: undefined,
    name: undefined,
}

export const settingsSlice = createSlice({
    name: 'settingsSlice',
    initialState,
    reducers: {
        setSettingsField(state, {payload: {field, value}}: PayloadAction<{field: keyof typeof initialState | string, value: any}>) {
            if(field === 'role') {
                localStorage.setItem(field, value);
            }
            // @ts-ignore
            state[field] = value;
        },
        resetSettingsState(state) {
            state = initialState;
        }
    }
});
export const settingsReducer = settingsSlice.reducer;
export const settingsSliceActions = settingsSlice.actions;

