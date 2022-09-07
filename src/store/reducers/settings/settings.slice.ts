import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserRoleEnum} from "../backend/backend.api.types";

type SettingsSliceStateType = {
    id: string | undefined;
    role: UserRoleEnum | '';
    phone: number | undefined;
    name: string | undefined;
    payments: Array<{ btcPayId: string }> | undefined;
    wallet?: {
        value: number;
        hold: number;
    }
}

const initialState: SettingsSliceStateType = {
    id: undefined,
    role: (localStorage.getItem('role') || '') as (UserRoleEnum | ''),
    phone: undefined,
    name: undefined,
    payments: undefined,
    wallet: {
        value: 0,
        hold: 0,
    },
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

