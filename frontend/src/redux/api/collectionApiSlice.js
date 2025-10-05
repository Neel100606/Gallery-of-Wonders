import { apiSlice } from "./apiSlice";
import { COLLECTIONS_URL } from "../constant.js";

export const collectionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get the logged-in user's own collections
    getMyCollections: builder.query({
      query: () => ({
        url: `${COLLECTIONS_URL}/mine`,
      }),
      providesTags: ["Collection"],
      keepUnusedDataFor: 5,
    }),

    // Mutation to create a new collection
    createCollection: builder.mutation({
      query: (data) => ({
        url: COLLECTIONS_URL,
        method: "POST",
        body: data, // { name, description, isPrivate }
      }),
      invalidatesTags: ["Collection"],
    }),

    // Mutation to add a work to a specific collection
    addWorkToCollection: builder.mutation({
      query: ({ collectionId, workId }) => ({
        url: `${COLLECTIONS_URL}/${collectionId}/add-work`,
        method: "PUT",
        body: { workId },
      }),
      invalidatesTags: ["Collection"],
    }),

    // Mutation to remove a work from a specific collection
    removeWorkFromCollection: builder.mutation({
      query: ({ collectionId, workId }) => ({
        url: `${COLLECTIONS_URL}/${collectionId}/remove-work`,
        method: "PUT",
        body: { workId },
      }),
      // 👇 Invalidate both 'Collection' and the specific collection's tag
      invalidatesTags: (result, error, { collectionId }) => [
        { type: "Collection", id: collectionId },
        "Collection",
      ],
    }),
    getCollectionDetails: builder.query({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}`,
      }),
      // 👇 Provide a specific tag for this collection
      providesTags: (result, error, id) => [{ type: "Collection", id }],
    }),

    // 👇 ADD THIS MUTATION
    deleteCollection: builder.mutation({
      query: (id) => ({
        url: `${COLLECTIONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collection"],
    }),

    // 👇 ADD THIS MUTATION
    updateCollection: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${COLLECTIONS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Collection", id },
        "Collection",
      ],
    }),

    getCollectionsByUserId: builder.query({
      query: (userId) => ({
        url: `${COLLECTIONS_URL}/user/${userId}`,
      }),
      providesTags: ["Collection"],
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
