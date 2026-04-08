// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
    credentials: "include",
    prepareHeaders: (headers) => {
      // const token = Cookies?.get("accessToken");
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWNlMjIxNzkyMjM4NTE3NzU3NmZhYjYiLCJlbWFpbCI6Imk3MWFlaDR0N25AbG5vdmljLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzc1NjIyNTM0LCJleHAiOjE3NzU3MDg5MzR9._GKH9WUIzxAt7PhpMm_duSMlPvriGF6coJmdALvDUTU";

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
  ],
});

// Export hooks for usage in functional components
export default baseApi;
