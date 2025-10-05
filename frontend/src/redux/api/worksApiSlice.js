import { apiSlice } from './apiSlice.js';
import { WORKS_URL } from '../constant';

export const worksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createWork: builder.mutation({
      query: (data) => ({
        url: `${WORKS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Work'], 
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
      keepUnusedDataFor: 5,
    }),

    toggleLike: builder.mutation({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}/like`,
        method: "PUT",
      }),
    }),
    getMyWorks: builder.query({
      query: () => ({
        url: `${WORKS_URL}/mine`,
      }),
      providesTags: ['MyWorks'],
      keepUnusedDataFor: 5,
    }),

    deleteWork: builder.mutation({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Work', 'MyWorks'],
    }),
    updateWork: builder.mutation({
      query: ({ workId, formData }) => ({
        url: `${WORKS_URL}/${workId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Work', 'MyWorks'],
    }),



  }),
});

export const { useCreateWorkMutation, useGetWorksQuery, useGetWorkDetailsQuery, useToggleLikeMutation, useGetMyWorksQuery, useDeleteWorkMutation, useUpdateWorkMutation } = worksApiSlice;