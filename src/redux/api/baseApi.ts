// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies?.get("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "SubscriptionPan",
    "UserManagement",
    "TeamManagement",
    "CompanyManagement",
    "categorise",
    "mainUser",
    "settings",
    "Department",
  ],
});

// Export hooks for usage in functional components
export default baseApi;

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const baseApi = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
//     credentials: "include", // ✅ send cookies automatically
//     // No prepareHeaders needed for cookie auth
//   }),
//   endpoints: () => ({}),
//   tagTypes: [
//     "User",
//     "SubscriptionPan",
//     "UserManagement",
//     "TeamManagement",
//     "CompanyManagement",
//     "categorise",
//     "mainUser",
//   ],
// });

// export default baseApi;
