import { apiSlice } from "./apiSlice.js";
import { WORKS_URL } from "../constant";

export const worksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWork: builder.mutation({
      query: (data) => ({
        url: `${WORKS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Work"],
    }),
    getWorks: builder.query({
      query: ({ category }) => {
        const params = {};
        if (category) {
          params.category = category;
        }
        return {
          url: WORKS_URL,
          params,
        };
      },
      providesTags: ["Work"],
      keepUnusedDataFor: 5,
    }),
    getWorkDetails: builder.query({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}`,
      }),
      providesTags: ["Work"],
      keepUnusedDataFor: 5,
    }),
    toggleLike: builder.mutation({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}/like`,
        method: "PUT",
      }),
      invalidatesTags: ["Work"],
    }),
    getMyWorks: builder.query({
      query: () => ({
        url: `${WORKS_URL}/mine`,
      }),
      providesTags: ["Work"],
      keepUnusedDataFor: 5,
    }),
    deleteWork: builder.mutation({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Work"],
    }),
    updateWork: builder.mutation({
      query: ({ workId, formData }) => ({
        url: `${WORKS_URL}/${workId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Work"],
    }),
    getWorksByUserId: builder.query({
      query: (userId) => ({
        url: `${WORKS_URL}/user/${userId}`,
      }),
      providesTags: ["Work"],
    }),
    searchWorks: builder.query({
      query: (keyword) => ({
        url: `${WORKS_URL}/search/${keyword}`,
      }),
      providesTags: ["Work"],
    }),
    getWorkStats: builder.query({
      query: () => ({
        url: `${WORKS_URL}/stats/mine`,
      }),
      providesTags: ["Work"],
    }),
    analyzeImage: builder.mutation({
      query: (data) => ({
        url: `${WORKS_URL}/analyze-image`,
        method: "POST",
        body: data,
      }),
    }),
    getSimilarWorks: builder.query({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}/similar`,
      }),
      providesTags: ["Work"],
    }),
  }),
});

export const {
  useCreateWorkMutation,
  useGetWorksQuery,
  useGetWorkDetailsQuery,
  useToggleLikeMutation,
  useGetMyWorksQuery,
  useDeleteWorkMutation,
  useUpdateWorkMutation,
  useGetWorksByUserIdQuery,
  useSearchWorksQuery,
  useGetWorkStatsQuery,
  useAnalyzeImageMutation,
  useGetSimilarWorksQuery,
} = worksApiSlice;
