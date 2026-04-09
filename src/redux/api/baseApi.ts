// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies?.get("accessToken");
      console.log("token:", token);
      if (token) {
        headers.set("Authorization", `${token}`);
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
  ],
});

// Export hooks for usage in functional components
export default baseApi;
