import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserRoleEnum} from "../backend/backend.api.types";

type SettingsSliceStateType = {
    role: UserRoleEnum | '';
    phone: string | undefined;
    name: string | undefined;
}

const initialState: SettingsSliceStateType = {
    role: (localStorage.getItem('role') || '') as (UserRoleEnum | ''),
    phone: undefined,
    name: undefined,
}

export const settingsSlice = createSlice({
    name: 'settingsSlice',
    initialState,
    reducers: {
        setField(state, {payload: {field, value}}: PayloadAction<{field: keyof typeof initialState | string, value: any}>) {
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

export const settingsSliceActions = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;

