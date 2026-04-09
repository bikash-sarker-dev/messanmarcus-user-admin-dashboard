import baseApi from "../baseApi";

export const allUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    aiGeneratePost: builder.mutation({
      query: (body) => ({
        url: "/ai/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["mainUser"],
    }),

    aiReGeneratePost: builder.mutation({
      query: (body) => ({
        url: "/ai/regenerate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["mainUser"],
    }),

    sendRecongition: builder.mutation({
      query: (body) => ({
        url: "/recognition/send",
        method: "POST",
        body,
      }),
      invalidatesTags: ["mainUser"],
    }),

    // getAllUsers: builder.query({
    //   query: () => ({
    //     url: `/user/all-users`,
    //     method: "GET",
    //   }),
    //   providesTags: ["mainUser"],
    // }),

    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => `/user/all-users`,
    }),
  }),
});

export const {
  useAiGeneratePostMutation,
  useAiReGeneratePostMutation,
  useGetAllUsersQuery,
  useSendRecongitionMutation,
} = allUsersApi;
