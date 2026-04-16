import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await req.json();

    const secretKey = process.env.TOSS_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "TOSS_SECRET_KEY가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: "필수 결제 승인 정보가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("토스 결제 승인 실패:", data);

      return NextResponse.json(
        {
          success: false,
          message: data.message || "결제 승인에 실패했습니다.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "결제 승인 완료",
      payment: data,
    });
  } catch (error) {
    console.error("결제 승인 API 오류:", error);

    return NextResponse.json(
      {
        success: false,
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}