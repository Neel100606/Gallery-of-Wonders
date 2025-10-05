import { apiSlice } from "./apiSlice.js"; // Relative path adjusted
import { USERS_URL } from "../constant"; // Path adjusted

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
      }),
      keepUnusedDataFor: 5, // Keep data for 5 seconds after unmount
    }),
    getUserById: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useGetUserByIdQuery,
} = usersApiSlice;
