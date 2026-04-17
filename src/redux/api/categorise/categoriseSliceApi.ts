import baseApi from "../baseApi";

export const categoriseAip = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    aiGeneratePost: builder.mutation({
      query: (body) => ({
        url: "/ai/generate",
        method: "POST",
        body,
      }),
      invalidatesTags: ["mainUser"],
    }),

    getCategorise: builder.query({
      query: () => "/category",
      providesTags: ["categorise"],
    }),
  }),
});

export const { useGetCategoriseQuery } = categoriseAip;
