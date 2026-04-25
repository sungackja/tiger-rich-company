import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    const cookieName = process.env.ADMIN_COOKIE_NAME || "admin_auth";

    if (!adminPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "서버에 ADMIN_PASSWORD가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "로그인 성공",
    });

    response.cookies.set(cookieName, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Admin login API error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
