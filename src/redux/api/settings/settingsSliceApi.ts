import baseApi from "../baseApi";

export const settingsAip = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    profileUpdates: builder.mutation({
      query: (body) => ({
        url: "/user/update-my-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    createCategory: builder.mutation({
      query: (body) => ({
        url: "/category/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    categoryImageUpload: builder.mutation({
      query: ({ body, id }) => ({
        url: `/category/${id}/images`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    updateCategory: builder.mutation({
      query: ({ body, id }) => ({
        url: `/category/update-category/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/delete-category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["settings"],
    }),

    deleteCategoryImage: builder.mutation({
      query: (body) => ({
        url: `/category/image/`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    allCategory: builder.query({
      query: () => "/category",
      providesTags: ["settings"],
    }),

    pointDristribute: builder.mutation({
      query: (body) => ({
        url: "/wallet/distribute",
        method: "POST",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    pointReset: builder.mutation({
      query: (body) => ({
        url: "/wallet/reset",
        method: "POST",
        body,
      }),
      invalidatesTags: ["settings"],
    }),

    giveTheUserPoint: builder.mutation({
      query: (body) => ({
        url: "/wallet/set-user-points",
        method: "POST",
        body,
      }),
      invalidatesTags: ["settings"],
    }),
  }),
});

export const {
  useAllCategoryQuery,
  useCreateCategoryMutation,
  useProfileUpdatesMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  usePointDristributeMutation,
  useCategoryImageUploadMutation,
  useDeleteCategoryImageMutation,
  useGiveTheUserPointMutation,
  usePointResetMutation,
} = settingsAip;
