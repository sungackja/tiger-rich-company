import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      product,
      memo,
      date1,
      time1,
      date2,
      time2,
      date3,
      time3,
      payment,
    } = body;

    if (
      !name ||
      !phone ||
      !product ||
      !date1 ||
      !time1 ||
      !date2 ||
      !time2 ||
      !date3 ||
      !time3 ||
      !payment
    ) {
      return NextResponse.json(
        { success: false, message: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    if (supabaseAdmin) {
      const { error: dbError } = await supabaseAdmin
        .from("consultations")
        .insert([
          {
            name,
            phone,
            product,
            memo: memo || null,
            date1,
            time1,
            date2,
            time2,
            date3,
            time3,
            payment,
          },
        ]);

      if (dbError) {
        console.error("Supabase insert error:", dbError);
        return NextResponse.json(
          {
            success: false,
            message: "상담 신청 저장 중 오류가 발생했습니다.",
          },
          { status: 500 }
        );
      }
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const telegramMessage = `
새 상담 신청이 들어왔습니다.

이름: ${name}
연락처: ${phone}
상담 상품: ${product}

1순위: ${date1} ${time1}
2순위: ${date2} ${time2}
3순위: ${date3} ${time3}

결제 방식: ${payment}
상담 내용: ${memo || "-"}
      `.trim();

      const telegramRes = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
          }),
        }
      );

      if (!telegramRes.ok) {
        const telegramErrorText = await telegramRes.text();
        console.error("Telegram send error:", telegramErrorText);
      }
    }

    return NextResponse.json({
      success: true,
      message: "상담 신청이 정상적으로 접수되었습니다.",
    });
  } catch (error) {
    console.error("Telegram API error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
