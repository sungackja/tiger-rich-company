export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return Response.json(
        { error: "텔레그램 환경변수가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const message = `
[신규 상담 신청]

신청자: ${body.name}
연락처: ${body.phone}
상품: ${body.product}

1지망: ${body.date1} ${body.time1}
2지망: ${body.date2} ${body.time2}
3지망: ${body.date3} ${body.time3}

결제방식: ${body.payment}
    `.trim();

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    const telegramData = await telegramRes.json();

    if (!telegramRes.ok) {
      return Response.json(
        { error: "텔레그램 전송 실패", detail: telegramData },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "서버 오류", detail: String(error) },
      { status: 500 }
    );
  }
}