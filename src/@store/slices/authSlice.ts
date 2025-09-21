import { clearToken, getToken, getUser, saveToken } from "@/@lib/tokens";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = { booted: boolean; token: string | null; user: { id: string; name: string; email: string } | null }
const initialState: AuthState = { booted: false, token: null, user: null }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        boot(state) { state.token = getToken(); state.user = getUser(); state.booted = true },
        loginSuccess(state, action: PayloadAction<{ token: string; user: AuthState['user'] }>) {
            state.token = action.payload.token; state.user = action.payload.user; state.booted = true; saveToken(action.payload.token, 24 * 60, action.payload.user!)
        },
        logout(state) { state.token = null; state.user = null; state.booted = true; clearToken() },
    }
})


export const { boot, loginSuccess, logout } = authSlice.actions
export default authSlice.reducer