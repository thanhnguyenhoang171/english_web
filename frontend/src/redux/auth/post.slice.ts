// postSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IPost } from '../../types/backend';
import { callFetchPost } from '../../api/postApi';

interface IState {
    isFetching: boolean;
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: IPost[];
}

export const fetchPost = createAsyncThunk(
    'post/fetchPost',
    async ({ query, append }: { query: string; append?: boolean }) => {
        const response = await callFetchPost(query);
        return { ...response, append };
    },
);

const initialState: IState = {
    isFetching: false,
    meta: {
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0,
    },
    result: [],
};

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        resetPosts: (state) => {
            state.result = [];
            state.meta.current = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPost.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(fetchPost.rejected, (state) => {
                state.isFetching = false;
            })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.isFetching = false;
                if (action.payload?.data?.data) {
                    const meta = action.payload.data.data.meta;
                    const newPosts = action.payload.data.data.result;

                    state.meta = meta;

                    if (action.payload.append) {
                        // nối thêm bài viết
                        state.result = [...state.result, ...newPosts];
                    } else {
                        // replace toàn bộ
                        state.result = newPosts;
                    }
                }
            });
    },
});

export const { resetPosts } = postSlice.actions;
export default postSlice.reducer;
