import baseApi from "../../baseApi";

export const superAdminDashboardOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    paymentCreate: builder.mutation({
      query: (body) => ({
        url: "/payments/subscription/create",
        method: "POST",
        body,
      }),
    }),

    getsuperAdminDashboardOverview: builder.query({
      query: () => ({
        url: `/analytics/super-admin/dashboard-overview`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetsuperAdminDashboardOverviewQuery } =
  superAdminDashboardOverviewApi;
