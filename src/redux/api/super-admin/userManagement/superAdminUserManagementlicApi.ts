import baseApi from "../../baseApi";

export const superAdminUserManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserManagement"],
    }),

    userSuspend: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["UserManagement"],
    }),

    getsuperAdminUsermanagement: builder.query({
      query: () => ({
        url: `/users`,
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),

    getsuperAdminUsermanagementSingle: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: ["UserManagement"],
    }),
  }),
});

export const {
  useGetsuperAdminUsermanagementQuery,
  useGetsuperAdminUsermanagementSingleQuery,
  useDeleteUserMutation,
  useUserSuspendMutation,
} = superAdminUserManagementApi;
