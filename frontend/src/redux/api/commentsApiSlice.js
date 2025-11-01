import { apiSlice } from "./apiSlice";
import { WORKS_URL, COMMENTS_URL } from "../constant";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsForWork: builder.query({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}/comments`,
      }),
      providesTags: ["Comment"],
    }),
    addCommentToWork: builder.mutation({
      query: ({ workId, text }) => ({
        url: `${WORKS_URL}/${workId}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Comment"],
    }),
    updateComment: builder.mutation({
        query: ({ commentId, text }) => ({
            url: `${COMMENTS_URL}/${commentId}`,
            method: 'PUT',
            body: { text },
        }),
        invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation({
        query: (commentId) => ({
            url: `${COMMENTS_URL}/${commentId}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Comment'],
    }),
  }),
});

export const { 
    useGetCommentsForWorkQuery, 
    useAddCommentToWorkMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentApiSlice;