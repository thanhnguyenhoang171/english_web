import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface LoginState {
    loading: boolean;
    error: string | null;
    success: boolean;
    user: any;
}

const initialState: LoginState = {
    loading: false,
    error: null,
    success: false,
    user: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (
        credentials: { username: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const res = await axios.post(
                'http://localhost:3000/api/auth/login',
                credentials,
            );
            return res.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response?.data || { message: 'Login failed' },
            );
        }
    },
);

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // chứa token/user info
                state.success = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                // Sử dụng rejectWithValue nên lỗi nằm ở payload
                state.error =
                    (action.payload as any)?.message || 'Login failed';
                state.success = false;
            });
    },
});
export const { logout } = loginSlice.actions;
export default loginSlice.reducer;
