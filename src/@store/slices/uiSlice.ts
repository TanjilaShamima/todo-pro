import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type Toast = { id: string; title: string; description?: string; type?: 'info' | 'success' | 'error' }


type UiState = { theme: 'light' | 'dark'; toasts: Toast[] }
const initialState: UiState = { theme: 'light', toasts: [] }


const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme(s) { s.theme = s.theme === 'light' ? 'dark' : 'light' },
        setTheme(s, a: PayloadAction<'light' | 'dark'>) { s.theme = a.payload },
        addToast(s, a: PayloadAction<Omit<Toast, 'id'>>) { s.toasts.push({ id: crypto.randomUUID(), ...a.payload }) },
        removeToast(s, a: PayloadAction<string>) { s.toasts = s.toasts.filter(t => t.id !== a.payload) },
    }
})
export const { toggleTheme, setTheme, addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer