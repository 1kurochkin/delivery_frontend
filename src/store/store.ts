import {configureStore} from "@reduxjs/toolkit";
import {appReducer} from "./reducers/app/app.slice";
import {setupListeners} from "@reduxjs/toolkit/query";
import {backendApi} from "./reducers/backend/backend.api";
import {settingsReducer} from "./reducers/settings/settings.slice";

export const store = configureStore({
    reducer: {
        [backendApi.reducerPath]: backendApi.reducer,
        app: appReducer,
        settings: settingsReducer,
    },
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware().concat(backendApi.middleware)
    )
});

setupListeners(store.dispatch);

export type RootStateType = ReturnType<typeof store.getState>