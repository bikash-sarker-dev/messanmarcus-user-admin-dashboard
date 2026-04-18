import baseApi from "../baseApi";

export const reportsAip = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // aiGeneratePost: builder.mutation({
    //   query: (body) => ({
    //     url: "/ai/generate",
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["mainUser"],
    // }),

    getAdminReport: builder.query({
      query: () => "/admin/reports",
      // providesTags: ["reports"],
    }),
  }),
});

export const { useGetAdminReportQuery } = reportsAip;
