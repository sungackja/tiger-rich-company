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

type CreatedSpreadsheet = {
  id: string;
  title: string;
  url: string;
};

const SHEET_NAME = "상담신청";

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
    scope:
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
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

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function formatTitleDate(date: Date) {
  const parts = new Intl.DateTimeFormat("ko-KR", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "00";
  const month = parts.find((part) => part.type === "month")?.value || "00";
  const day = parts.find((part) => part.type === "day")?.value || "00";

  return `${year}${month}${day}`;
}

function sanitizeTitlePart(value: string) {
  return value
    .trim()
    .replace(/[\\/:*?"<>|#%{}[\]^~`]/g, "")
    .replace(/\s+/g, "");
}

function getPhoneLastFour(phone: string) {
  const digits = phone.replace(/\D/g, "");

  return digits.slice(-4).padStart(4, "0");
}

function createSpreadsheetTitle(body: ConsultationPayload, submittedDate: Date) {
  return `신청날짜(${formatTitleDate(submittedDate)})_${sanitizeTitlePart(
    body.name
  )}_${getPhoneLastFour(body.phone)}`;
}

async function createSpreadsheet(
  accessToken: string,
  title: string
): Promise<CreatedSpreadsheet> {
  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: SHEET_NAME,
          },
        },
      ],
    }),
  });
  const createData = await createRes.json();

  if (!createRes.ok || !createData.spreadsheetId) {
    console.error("Google Sheets create error:", createData);
    throw new Error("스프레드시트 생성에 실패했습니다.");
  }

  return {
    id: createData.spreadsheetId,
    title: createData.properties?.title || title,
    url:
      createData.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${createData.spreadsheetId}`,
  };
}

async function writeSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  body: ConsultationPayload,
  submittedDate: Date
) {
  const rows = [
    ["접수일시", formatSubmittedAt(submittedDate)],
    [],
    ["번호", "문항", "답변"],
    ...questions.map((question) => [
      String(question.number),
      question.label,
      toCellValue(body[question.key]),
    ]),
  ];
  const range = encodeURIComponent(`${SHEET_NAME}!A1:C${rows.length}`);
  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );
  const updateData = await updateRes.json();

  if (!updateRes.ok) {
    console.error("Google Sheets write error:", updateData);
    throw new Error("스프레드시트 저장에 실패했습니다.");
  }
}

async function grantOwnerReadAccess(accessToken: string, spreadsheetId: string) {
  const ownerEmail = process.env.GOOGLE_DRIVE_OWNER_EMAIL;

  if (!ownerEmail) {
    throw new Error("GOOGLE_DRIVE_OWNER_EMAIL이 설정되지 않았습니다.");
  }

  const permissionRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/permissions?sendNotificationEmail=false`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "user",
        role: "reader",
        emailAddress: ownerEmail,
      }),
    }
  );
  const permissionData = await permissionRes.json();

  if (!permissionRes.ok) {
    console.error("Google Drive permission error:", permissionData);
    throw new Error("스프레드시트 읽기 권한 설정에 실패했습니다.");
  }
}

async function createConsultationSpreadsheet(body: ConsultationPayload) {
  const accessToken = await getGoogleAccessToken();
  const submittedDate = new Date();
  const title = createSpreadsheetTitle(body, submittedDate);
  const spreadsheet = await createSpreadsheet(accessToken, title);

  await writeSpreadsheetValues(accessToken, spreadsheet.id, body, submittedDate);
  await grantOwnerReadAccess(accessToken, spreadsheet.id);

  return spreadsheet;
}

async function sendTelegramMessage(
  body: ConsultationPayload,
  spreadsheet: CreatedSpreadsheet
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  const telegramMessage = `
새 상담 신청 스프레드시트가 생성되었습니다.

성함: ${body.name}
연락처: ${body.phone}
파일명: ${spreadsheet.title}
파일 링크: ${spreadsheet.url}
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

    const spreadsheet = await createConsultationSpreadsheet(body);

    await sendTelegramMessage(body, spreadsheet);

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
