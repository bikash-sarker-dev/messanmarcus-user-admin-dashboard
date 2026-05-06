// import Cookies from "js-cookie";

// export const logOutHandle = (router: any) => {
//   const isProduction = process.env.NODE_ENV === "production";

//   const cookieOptions = {
//     domain: isProduction ? ".greetely.com" : undefined,
//     path: "/",
//     secure: isProduction,
//     sameSite: isProduction ? "None" : "Lax",
//   } as const;

//   Cookies.remove("accessToken", cookieOptions);
//   Cookies.remove("refreshToken", cookieOptions);

//   const domain = window.location.origin;

//   router.push(
//     domain === "http://localhost:3010"
//       ? "http://localhost:3041"
//       : "https://greetely.com",
//   );
// };

// import Cookies from "js-cookie";

// export const logOutHandle = (router: any) => {
//   const isProduction = process.env.NODE_ENV === "production";

//   const cookieOptions = {
//     domain: isProduction ? ".greetely.com" : undefined,
//     path: "/",
//     secure: isProduction,
//     sameSite: isProduction ? "None" : "Lax",
//   } as const;

//   // 🔥 Remove tokens
//   Cookies.remove("accessToken", cookieOptions);
//   Cookies.remove("refreshToken", cookieOptions);

//   // 🔥 Clear storage (VERY IMPORTANT)
//   localStorage.clear();
//   sessionStorage.clear();

//   // 🔥 Redirect always to login page
//   if (typeof window !== "undefined") {
//     const currentHost = window.location.hostname;

//     if (currentHost === "dashboard.greetely.com") {
//       router.push("https://greetely.com");
//     } else {
//       router.push("https://greetely.com");
//     }
//   }
// };

import Cookies from "js-cookie";

const isProduction = process.env.NODE_ENV === "production";

export const logOutHandle = (router?: any) => {
  const domain = window.location.origin;
  // Remove cookies from shared domain (covers both greetely.com & dashboard.greetely.com)
  Cookies.remove("accessToken", {
    domain: isProduction ? ".greetely.com" : undefined,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  Cookies.remove("refreshToken", {
    domain: isProduction ? ".greetely.com" : undefined,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  });

  // Also remove without domain (covers the rememberMe path where no domain was set)
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");

  // Clear localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("rememberMe");

  // Clear sessionStorage
  sessionStorage.removeItem("redirectAfterLogin");

  // Clear Redux state (optional, call dispatch if available)
  // dispatch(clearUser());

  // Redirect to login
  if (router) {
    router.push(
      domain === "http://localhost:3010"
        ? "http://localhost:3041"
        : "https://greetely.com",
    );
    router.refresh();
  }
};
