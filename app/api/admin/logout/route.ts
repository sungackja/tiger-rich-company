import { NextResponse } from "next/server";

export async function POST() {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "admin_auth";

  const response = NextResponse.json({
    success: true,
    message: "로그아웃 완료",
  });

  response.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}