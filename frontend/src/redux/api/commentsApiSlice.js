import { apiSlice } from "./apiSlice";
import { WORKS_URL } from "../constant";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsForWork: builder.query({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}/comments`,
      }),
      providesTags: ["Comment"],
      keepUnusedDataFor: 5,
    }),

    addCommentToWork: builder.mutation({
      query: ({ workId, text }) => ({
        url: `${WORKS_URL}/${workId}/comments`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const { useGetCommentsForWorkQuery, useAddCommentToWorkMutation } = commentApiSlice;