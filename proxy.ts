import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const cookieName = process.env.ADMIN_COOKIE_NAME || "admin_auth";
  const authCookie = req.cookies.get(cookieName)?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    if (authCookie === "authenticated") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (authCookie !== "authenticated") {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};