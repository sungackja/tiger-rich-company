import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type ConsultationPayload = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  family: string;
  homeAddress: string;
  investmentAddress: string;
  income: string;
  assets: string;
  debts: string;
  loanIntent: string;
  purpose: string[];
  consultType: string;
  preferredSchedule: string;
  message: string;
  receiptType: string;
  receiptNumber: string;
  privacyConsent: string;
};

type Question = {
  number: number;
  key: keyof ConsultationPayload;
  label: string;
};

const questions: Question[] = [
  { number: 1, key: "name", label: "성함" },
  { number: 2, key: "age", label: "연령대" },
  { number: 3, key: "gender", label: "성별" },
  { number: 4, key: "phone", label: "연락처" },
  { number: 5, key: "family", label: "가족구성원" },
  { number: 6, key: "homeAddress", label: "현재 거주하시는 자택 주소" },
  { number: 7, key: "investmentAddress", label: "투자하신 다른 부동산 주소" },
  { number: 8, key: "income", label: "연봉" },
  { number: 9, key: "assets", label: "자산 현황" },
  { number: 10, key: "debts", label: "부채 현황" },
  { number: 11, key: "loanIntent", label: "대출 가능 범위 내 추가 투자 의향" },
  { number: 12, key: "purpose", label: "부동산 매수 목적" },
  { number: 13, key: "consultType", label: "상담 방식" },
  { number: 14, key: "preferredSchedule", label: "원하시는 날짜 및 시간 / 지역" },
  { number: 15, key: "message", label: "이 외 하고싶으신 말씀" },
  { number: 16, key: "receiptType", label: "현금영수증 유형" },
  { number: 17, key: "receiptNumber", label: "현금영수증 발급 번호" },
  { number: 18, key: "privacyConsent", label: "개인정보 수집 및 이용 동의" },
];

function base64Url(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function createJwt(clientEmail: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };
  const claimSet = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(claimSet)
  )}`;
  const signer = crypto.createSign("RSA-SHA256");

  signer.update(unsignedToken);
  signer.end();

  const signature = signer
    .sign(privateKey)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsignedToken}.${signature}`;
}

async function getGoogleAccessToken() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Google 서비스 계정 환경변수가 설정되지 않았습니다.");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createJwt(clientEmail, privateKey),
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    console.error("Google token error:", tokenData);
    throw new Error("Google 인증에 실패했습니다.");
  }

  return tokenData.access_token as string;
}

function getMissingQuestionNumber(body: ConsultationPayload) {
  for (const question of questions) {
    const value = body[question.key];

    if (Array.isArray(value)) {
      if (value.length === 0) return question.number;
      continue;
    }

    if (typeof value !== "string" || !value.trim()) return question.number;
  }

  return null;
}

function toCellValue(value: string | string[]) {
  return Array.isArray(value) ? value.join(", ") : value.trim();
}

async function appendToSheet(body: ConsultationPayload) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "상담신청";

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID가 설정되지 않았습니다.");
  }

  const accessToken = await getGoogleAccessToken();
  await ensureSheet(accessToken, spreadsheetId, sheetName);

  const row = [
    new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
    ...questions.map((question) => toCellValue(body[question.key])),
  ];
  const range = encodeURIComponent(`${sheetName}!A:S`);
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const appendRes = await fetch(appendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [row],
    }),
  });
  const appendData = await appendRes.json();

  if (!appendRes.ok) {
    console.error("Google Sheets append error:", appendData);
    throw new Error("스프레드시트 저장에 실패했습니다.");
  }
}

async function ensureSheet(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string
) {
  const metadataRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const metadata = await metadataRes.json();

  if (!metadataRes.ok) {
    console.error("Google Sheets metadata error:", metadata);
    throw new Error("스프레드시트 정보를 불러오지 못했습니다.");
  }

  const sheetExists = metadata.sheets?.some(
    (sheet: { properties?: { title?: string } }) =>
      sheet.properties?.title === sheetName
  );

  if (!sheetExists) {
    const createRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        }),
      }
    );
    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error("Google Sheets create sheet error:", createData);
      throw new Error("스프레드시트 탭 생성에 실패했습니다.");
    }
  }

  const headerRange = encodeURIComponent(`${sheetName}!A1:S1`);
  const headerRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${headerRange}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const headerData = await headerRes.json();

  if (!headerRes.ok) {
    console.error("Google Sheets header read error:", headerData);
    throw new Error("스프레드시트 헤더 확인에 실패했습니다.");
  }

  if (headerData.values?.length) return;

  const headerValues = ["접수일시", ...questions.map((question) => question.label)];
  const updateHeaderRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${headerRange}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [headerValues],
      }),
    }
  );
  const updateHeaderData = await updateHeaderRes.json();

  if (!updateHeaderRes.ok) {
    console.error("Google Sheets header update error:", updateHeaderData);
    throw new Error("스프레드시트 헤더 생성에 실패했습니다.");
  }
}

async function sendTelegramMessage(body: ConsultationPayload, spreadsheetUrl: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  const telegramMessage = `
새 상담 신청이 스프레드시트에 저장되었습니다.

성함: ${body.name}
연락처: ${body.phone}
파일 링크: ${spreadsheetUrl}
  `.trim();

  const telegramRes = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        disable_web_page_preview: true,
      }),
    }
  );

  if (!telegramRes.ok) {
    const telegramErrorText = await telegramRes.text();
    console.error("Telegram send error:", telegramErrorText);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ConsultationPayload;
    const missingQuestionNumber = getMissingQuestionNumber(body);

    if (missingQuestionNumber) {
      return NextResponse.json(
        {
          success: false,
          message: `${missingQuestionNumber}번 질문에 답변이 없습니다.`,
        },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const spreadsheetUrl =
      process.env.GOOGLE_SPREADSHEET_URL ||
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

    await appendToSheet(body);
    await sendTelegramMessage(body, spreadsheetUrl);

    return NextResponse.json({
      success: true,
      message: "상담 신청이 정상적으로 접수되었습니다.",
    });
  } catch (error) {
    console.error("Consultation API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
