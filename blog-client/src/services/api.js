// src/services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Post', 'User', 'Comment', 'Story'],
    endpoints: (builder) => ({
        // Feed endpoints
        getFeedPosts: builder.query({
            query: (page = 1) => `/posts/feed?page=${page}`,
            providesTags: ['Post']
        }),

        // Post endpoints
        getPostById: builder.query({
            query: (id) => `/posts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Post', id }]
        }),
        createPost: builder.mutation({
            query: (postData) => ({
                url: '/posts',
                method: 'POST',
                body: postData
            }),
            invalidatesTags: ['Post']
        }),

        // User endpoints
        getUserProfile: builder.query({
            query: (userId) => `/users/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'User', id: userId }]
        }),
        updateProfile: builder.mutation({
            query: ({ userId, ...profileData }) => ({
                url: `/users/${userId}`,
                method: 'PATCH',
                body: profileData
            }),
            invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }]
        }),

        // Comment endpoints
        getPostComments: builder.query({
            query: (postId) => `/posts/${postId}/comments`,
            providesTags: (result, error, postId) => [
                { type: 'Comment', id: 'LIST' },
                ...result.map(({ id }) => ({ type: 'Comment', id }))
            ]
        }),
        addComment: builder.mutation({
            query: ({ postId, content }) => ({
                url: `/posts/${postId}/comments`,
                method: 'POST',
                body: { content }
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: 'Post', id: postId },
                { type: 'Comment', id: 'LIST' }
            ]
        }),

        // Story endpoints
        getStories: builder.query({
            query: () => '/stories',
            providesTags: ['Story']
        }),
    })
})

// Export hooks for usage in components
export const {
    useGetFeedPostsQuery,
    useGetPostByIdQuery,
    useCreatePostMutation,
    useGetUserProfileQuery,
    useUpdateProfileMutation,
    useGetPostCommentsQuery,
    useAddCommentMutation,
    useGetStoriesQuery,
} = api