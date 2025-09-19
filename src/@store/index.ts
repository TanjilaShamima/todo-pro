'use client'
import { configureStore } from '@reduxjs/toolkit'

import { todosApi } from './services/todoApi'
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        [todosApi.reducerPath]: todosApi.reducer,
    },
    middleware: (gDM) => gDM().concat(todosApi.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


