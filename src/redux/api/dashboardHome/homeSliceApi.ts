import baseApi from "../baseApi";

export const dashboardHomeAip = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // aiGeneratePost: builder.mutation({
    //   query: (body) => ({
    //     url: "/ai/generate",
    //     method: "POST",
    //     body,
    //   }),
    //   // invalidatesTags: ["mainUser"],
    // }),

    getDashboardHome: builder.query({
      query: () => "/admin/dashboard",
      // providesTags: ["categorise"],
    }),

    getRecognitionHistroy: builder.query({
      query: () => "/recognition/history",
      // providesTags: ["categorise"],
    }),
  }),
});

export const { useGetDashboardHomeQuery, useGetRecognitionHistroyQuery } =
  dashboardHomeAip;
