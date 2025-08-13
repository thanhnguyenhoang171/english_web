import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { IPost } from '../../types/backend';
import { callFetchOwnerPost } from '../../api/postApi';

interface IState {
    isFetching: boolean;
    // meta: {
    //     current: number;
    //     pageSize: number;
    //     pages: number;
    //     total: number;
    // };
    result: IPost[];
}
// // First, create the thunk
// export const fetchFlashcard = createAsyncThunk(
//     'flashcard/fetchFlashcard',
//     async ({ query }: { query: string }) => {
//         const response = await callFetchPost(query);
//         return response;
//     },
// );

export const fetchOwnerPost = createAsyncThunk(
    'post/fetchOwnerPost',
    async () => {
        const response = await callFetchOwnerPost();
        return response.data;
    },
);
const initialState: IState = {
    isFetching: true,
    // meta: {
    //     current: 1,
    //     pageSize: 5,
    //     pages: 0,
    //     total: 0,
    // },
    result: [],
};

export const ownerPostSlide = createSlice({
    name: 'flashcard',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchOwnerPost.pending, (state) => {
            state.isFetching = true;
        });

        builder.addCase(fetchOwnerPost.rejected, (state) => {
            state.isFetching = false;
        });

        builder.addCase(fetchOwnerPost.fulfilled, (state, action) => {
            if (action.payload && action.payload.data && action.payload.data) {
                state.isFetching = false;
                // state.meta = action.payload.data.data?.meta;

                if (action.payload && Array.isArray(action.payload.data)) {
                    // gán result là mảng flashcard trả về
                    state.result = action.payload.data;
                } else {
                    state.result = [];
                }
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        });
    },
});

export const {} = ownerPostSlide.actions;

export default ownerPostSlide.reducer;
