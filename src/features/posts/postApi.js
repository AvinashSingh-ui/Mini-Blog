import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const postApi=createApi({
    reducerPath:"postApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"https://jsonplaceholder.typicode.com"
    }),
    tagTypes:["Posts", "Post"],
    endpoints:(builder)=>({
        getPosts:builder.query({
            query:()=>"/posts",
            providesTags: (result) =>
              result
                ? [
                    ...result.map(({ id }) => ({ type: 'Post', id })),
                    { type: 'Posts', id: 'LIST' },
                  ]
                : [{ type: 'Posts', id: 'LIST' }],
        }),
        getPostById:builder.query({
            query:(id)=>`/posts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Post', id }],
        }),
        getComments: builder.query({
            query: (postId) => `/posts/${postId}/comments`,
        }),
        createPost:builder.mutation({
            query:(newPost)=>({
                url:"/posts",
                method:"POST",
                body:newPost
            }),
            async onQueryStarted(newPost, { dispatch, queryFulfilled }) {
                try {
                    const { data: createdPost } = await queryFulfilled;
                    // Pessimistically update getPosts cache when post is created
                    dispatch(
                        postApi.util.updateQueryData('getPosts', undefined, (draft) => {
                            draft.unshift({ ...newPost, id: createdPost.id || Date.now() });
                        })
                    );
                } catch (err) {
                    console.error('Failed to create post:', err);
                }
            },
        }),
        editPost: builder.mutation({
            query: ({ id, ...updatedPost }) => ({
                url: `/posts/${id}`,
                method: "PUT",
                body: updatedPost,
            }),
            async onQueryStarted({ id, ...updatedPost }, { dispatch, queryFulfilled }) {
                // Optimistically update getPosts and getPostById caches
                const patchPostsList = dispatch(
                    postApi.util.updateQueryData('getPosts', undefined, (draft) => {
                        const post = draft.find((p) => String(p.id) === String(id));
                        if (post) {
                            Object.assign(post, updatedPost);
                        }
                    })
                );
                const patchSinglePost = dispatch(
                    postApi.util.updateQueryData('getPostById', String(id), (draft) => {
                        if (draft) {
                            Object.assign(draft, updatedPost);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchPostsList.undo();
                    patchSinglePost.undo();
                }
            },
        }),
        deletePost: builder.mutation({
            query: (id) => ({
                url: `/posts/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                // Optimistically delete post from getPosts cache
                const patchPostsList = dispatch(
                    postApi.util.updateQueryData('getPosts', undefined, (draft) => {
                        const index = draft.findIndex((p) => String(p.id) === String(id));
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchPostsList.undo();
                }
            },
        }),
    }),
});

export const {useGetPostsQuery,useGetPostByIdQuery,useGetCommentsQuery,useCreatePostMutation,useEditPostMutation,useDeletePostMutation}=postApi;