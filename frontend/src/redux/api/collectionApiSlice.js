import { apiSlice } from "./apiSlice";
import { COLLECTIONS_URL } from "../constant.js";

export const collectionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyCollections: builder.query({
      query: () => ({
        url: `${COLLECTIONS_URL}/mine`,
      }),
      providesTags: ["Collection"],
    }),
    createCollection: builder.mutation({
      query: (data) => ({
        url: COLLECTIONS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Collection"],
    }),
    addWorkToCollection: builder.mutation({
      query: ({ collectionId, workId }) => ({
        url: `${COLLECTIONS_URL}/${collectionId}/add-work`,
        method: "PUT",
        body: { workId },
      }),
      invalidatesTags: ["Collection"],
    }),
    removeWorkFromCollection: builder.mutation({
      query: ({ collectionId, workId }) => ({
        url: `${COLLECTIONS_URL}/${collectionId}/remove-work`,
        method: "PUT",
        body: { workId },
      }),
      invalidatesTags: ["Collection"],
    }),
    getCollectionDetails: builder.query({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Collection', id }],
    }),
    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Collection'],
    }),
    updateCollection: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${COLLECTIONS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Collection', id }, 'Collection'],
    }),
    getCollectionsByUserId: builder.query({
        query: (userId) => ({
            url: `${COLLECTIONS_URL}/user/${userId}`,
        }),
        providesTags: ['Collection'],
    }),
  }),
});

export const {
  useGetMyCollectionsQuery,
  useCreateCollectionMutation,
  useAddWorkToCollectionMutation,
  useRemoveWorkFromCollectionMutation,
  useGetCollectionDetailsQuery,
  useDeleteCollectionMutation,
  useUpdateCollectionMutation,
  useGetCollectionsByUserIdQuery,
} = collectionApiSlice;