import baseApi from "../baseApi";

export const allUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadAnalysisFile: builder.mutation({
      query: (body) => ({
        url: "/report-analysis/extract-report",
        method: "POST",
        body,
      }),
      invalidatesTags: ["reportAnalysis"],
    }),

    // get report history signle data
    getReportHistorySignle: builder.query({
      query: (id) => ({
        url: `/report-analysis/water-reports/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {} = allUsersApi;
