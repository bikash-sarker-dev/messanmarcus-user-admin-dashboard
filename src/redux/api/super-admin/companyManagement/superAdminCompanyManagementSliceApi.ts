import baseApi from "../../baseApi";

export const superAdminCompanyManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // paymentCreate: builder.mutation({
    //   query: (body) => ({
    //     url: "/payments/subscription/create",
    //     method: "POST",
    //     body,
    //   }),
    // }),

    companyStatus: builder.mutation({
      query: (id) => ({
        url: `/company/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["CompanyManagement"],
    }),

    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/company/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CompanyManagement"],
    }),

    getAllCompany: builder.query({
      query: () => ({
        url: `/company/list`,
        method: "GET",
      }),
      providesTags: ["CompanyManagement"],
    }),

    getCompanySingle: builder.query({
      query: (id) => ({
        url: `/company/${id}`,
        method: "GET",
      }),
      providesTags: ["CompanyManagement"],
    }),
  }),
});

export const {
  useGetAllCompanyQuery,
  useGetCompanySingleQuery,
  useDeleteCompanyMutation,
  useCompanyStatusMutation,
} = superAdminCompanyManagementApi;
