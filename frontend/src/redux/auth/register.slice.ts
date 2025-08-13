import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface RegisterState {
    loading: boolean;
    error: string | null;
    success: boolean;
    user: any;
}

const initialState: RegisterState = {
    loading: false,
    error: null,
    success: false,
    user: null,
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async (formData: any, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/auth/register',
                formData,
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(
                err.response.data.message || 'Registration failed',
            );
        }
    },
);

const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.success = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export default registerSlice.reducer;
