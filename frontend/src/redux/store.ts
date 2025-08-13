import { configureStore } from '@reduxjs/toolkit';
import accountReducer from './auth/account.slice';
import postReducer from './auth/post.slice';
import flashcardReducer from './flashcard/flashcard.slice';
import ownerPostReducer from './post/postOwner.slice';
export const store = configureStore({
    reducer: {
        // register: registerSlice,
        // login: loginSlice,
        account: accountReducer,
        post: postReducer,
        flashcard: flashcardReducer,
        ownerPost: ownerPostReducer,
    },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
