'use client'
import { configureStore } from '@reduxjs/toolkit'

import { todosApi } from './services/todoApi'
import authReducer from './slices/authSlice'
import todosReducer from './slices/todoSlice'
import uiReducer from './slices/uiSlice'


export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        todos: todosReducer,
        [todosApi.reducerPath]: todosApi.reducer,
    },
    middleware: (gDM) => gDM().concat(todosApi.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


