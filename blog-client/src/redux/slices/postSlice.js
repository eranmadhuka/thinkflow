// src/redux/slices/postSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    currentPost: null,
    loading: false,
    error: null
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        fetchPostsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchPostsSuccess(state, action) {
            state.posts = action.payload;
            state.loading = false;
        },
        fetchPostsFailure(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        setCurrentPost(state, action) {
            state.currentPost = action.payload;
        }
    }
});

export const {
    fetchPostsStart,
    fetchPostsSuccess,
    fetchPostsFailure,
    setCurrentPost
} = postSlice.actions;
export default postSlice.reducer;