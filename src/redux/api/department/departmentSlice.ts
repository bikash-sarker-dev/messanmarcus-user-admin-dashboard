// import baseApi from "../baseApi";

// export const getMe = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // need to add types
//     getMeProfile: builder.query({
//       query: () => "/users/profile",
//       providesTags: ["User"],
//     }),
//   }),
// });

// export const { useGetMeProfileQuery } = getMe;

import baseApi from "../baseApi";

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartment: builder.query({
      query: () => "/department",
      providesTags: ["Department"],
    }),

    createDepartment: builder.mutation({
      query: (payload) => ({
        url: "/department",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),

    updateDepartment: builder.mutation({
      query: ({ payload, id }) => ({
        url: `/department/update-department/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Department"],
    }),

    deteteDepartment: builder.mutation({
      query: (id) => ({
        url: `/department/delete-department/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useDeteteDepartmentMutation,
  useUpdateDepartmentMutation,
} = departmentApi;
