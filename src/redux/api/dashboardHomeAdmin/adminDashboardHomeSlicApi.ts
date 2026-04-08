import baseApi from "../baseApi";

export const adminDashboardOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardHomeOverview: builder.query({
      query: () => ({
        url: `/analytics/owner-admin/dashboard-overview`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAdminDashboardHomeOverviewQuery } =
  adminDashboardOverviewApi;
