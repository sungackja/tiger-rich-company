import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "허용되지 않은 상태값입니다.",
        },
        { status: 400 }
      );
    }

    const consultationId = Number(id);

    if (!consultationId || Number.isNaN(consultationId)) {
      return NextResponse.json(
        {
          success: false,
          message: "잘못된 상담 ID입니다.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("consultations")
      .update({ status })
      .eq("id", consultationId);

    if (error) {
      console.error("상태 업데이트 오류:", error);

      return NextResponse.json(
        {
          success: false,
          message: "상태 변경 중 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "상태가 변경되었습니다.",
    });
  } catch (error) {
    console.error("상태 변경 API 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}