import { apiSlice } from "./apiSlice.js";
import { WORKS_URL } from "../constant";
import { toast } from "react-toastify";

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
      keepUnusedDataFor: 5,
    }),

    toggleLike: builder.mutation({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}/like`,
        method: "PUT",
      }),
      async onQueryStarted(workId, { dispatch, queryFulfilled, getState }) {
        const { userInfo } = getState().auth;
        if (!userInfo) return;

        // Define the patch result for updating the getWorks query
        const worksPatchResult = dispatch(
          apiSlice.util.updateQueryData("getWorks", {}, (draft) => {
            const work = draft.find((w) => w._id === workId);
            if (work) {
              const hasLiked = work.likes.includes(userInfo._id);
              if (hasLiked) {
                // Remove user's like
                work.likes = work.likes.filter((id) => id !== userInfo._id);
              } else {
                // Add user's like
                work.likes.push(userInfo._id);
              }
            }
          })
        );

        // Define the patch result for updating the getWorkDetails query (if the user is on that page)
        const workDetailsPatchResult = dispatch(
          apiSlice.util.updateQueryData("getWorkDetails", workId, (draft) => {
            const hasLiked = draft.likes.includes(userInfo._id);
            if (hasLiked) {
              draft.likes = draft.likes.filter((id) => id !== userInfo._id);
            } else {
              draft.likes.push(userInfo._id);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          worksPatchResult.undo();
          workDetailsPatchResult.undo();
          toast.error("Failed to update like");
        }
      },
    }),
    getMyWorks: builder.query({
      query: () => ({
        url: `${WORKS_URL}/mine`,
      }),
      providesTags: ["MyWorks"],
      keepUnusedDataFor: 5,
    }),

    deleteWork: builder.mutation({
      query: (workId) => ({
        url: `${WORKS_URL}/${workId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Work", "MyWorks"],
    }),
    updateWork: builder.mutation({
      query: ({ workId, formData }) => ({
        url: `${WORKS_URL}/${workId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Work", "MyWorks"],
    }),
    getWorksByUserId: builder.query({
      query: (userId) => ({
        url: `${WORKS_URL}/user/${userId}`,
      }),
      providesTags: ["Work"],
      keepUnusedDataFor: 5,
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
  providesTags: ['Work'], // Invalidate if works change
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
} = worksApiSlice;
