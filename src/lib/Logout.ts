import Cookies from "js-cookie";

export const logOutHandle = (router: any) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    domain: isProduction ? ".greetely.com" : undefined,
    path: "/",
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  } as const;

  Cookies.remove("accessToken", cookieOptions);
  Cookies.remove("refreshToken", cookieOptions);

  const domain = window.location.origin;

  router.push(
    domain === "http://localhost:3010"
      ? "http://localhost:3041"
      : "https://greetely.com",
  );
};
