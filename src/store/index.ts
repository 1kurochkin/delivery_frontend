import {configureStore} from "@reduxjs/toolkit";
import {backendReducer} from './reducers/backend/backend.reducer'

export const store = configureStore({
    reducer: {
        [backendReducer.reducerPath]: backendReducer.reducer
    }
})