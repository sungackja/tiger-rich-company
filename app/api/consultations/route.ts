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
  sheetId: number;
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

function getGoogleErrorMessage(data: unknown, fallback: string) {
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    data.error &&
    typeof data.error === "object" &&
    "message" in data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }

  return fallback;
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
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive",
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

function createCoreSummary(body: ConsultationPayload) {
  const age = body.age.replace(/\s+/g, "");
  const gender = body.gender === "여" ? "여성" : body.gender === "남" ? "남성" : body.gender;
  const consultType = body.consultType
    .replace(/\([^)]*\)/g, "")
    .replace(/\/\/.*$/g, "")
    .replace(/\s+/g, "")
    .trim();

  return `핵심: ${body.name}_${age}_${gender}_${consultType}`;
}

function createSpreadsheetTitle(body: ConsultationPayload, submittedDate: Date) {
  return `${formatTitleDate(submittedDate)}_${sanitizeTitlePart(
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
    throw new Error(
      getGoogleErrorMessage(createData, "스프레드시트 생성에 실패했습니다.")
    );
  }

  return {
    id: createData.spreadsheetId,
    sheetId: createData.sheets?.[0]?.properties?.sheetId ?? 0,
    title: createData.properties?.title || title,
    url:
      createData.spreadsheetUrl ||
      `https://docs.google.com/spreadsheets/d/${createData.spreadsheetId}`,
  };
}

async function moveSpreadsheetToFolder(
  accessToken: string,
  spreadsheetId: string
) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID?.trim();

  if (!folderId) return;

  const parentsRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${spreadsheetId}?fields=parents&supportsAllDrives=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const parentsData = await parentsRes.json();

  if (!parentsRes.ok) {
    console.error("Google Drive parent read error:", parentsData);
    throw new Error("스프레드시트 폴더 정보를 불러오지 못했습니다.");
  }

  const removeParents = Array.isArray(parentsData.parents)
    ? parentsData.parents.join(",")
    : "";
  const params = new URLSearchParams({
    addParents: folderId,
    fields: "id,parents",
    supportsAllDrives: "true",
  });

  if (removeParents) {
    params.set("removeParents", removeParents);
  }

  const moveRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${spreadsheetId}?${params.toString()}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const moveData = await moveRes.json();

  if (!moveRes.ok) {
    console.error("Google Drive move error:", moveData);
    throw new Error("스프레드시트 폴더 이동에 실패했습니다.");
  }
}

async function writeSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  body: ConsultationPayload,
  submittedDate: Date
) {
  const rows = [
    ["접수일시", formatSubmittedAt(submittedDate), ""],
    [createCoreSummary(body), "", ""],
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

async function formatSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  sheetId: number
) {
  const longMessageRowIndex = 18;
  const totalRowCount = 22;
  const formatRes = await fetch(
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
            updateDimensionProperties: {
              range: {
                sheetId,
                dimension: "COLUMNS",
                startIndex: 0,
                endIndex: 1,
              },
              properties: { pixelSize: 88 },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId,
                dimension: "COLUMNS",
                startIndex: 1,
                endIndex: 2,
              },
              properties: { pixelSize: 360 },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId,
                dimension: "COLUMNS",
                startIndex: 2,
                endIndex: 3,
              },
              properties: { pixelSize: 980 },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: longMessageRowIndex,
                endIndex: longMessageRowIndex + 1,
              },
              properties: { pixelSize: 760 },
              fields: "pixelSize",
            },
          },
          {
            mergeCells: {
              range: {
                sheetId,
                startRowIndex: 1,
                endRowIndex: 2,
                startColumnIndex: 0,
                endColumnIndex: 3,
              },
              mergeType: "MERGE_ALL",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: totalRowCount,
                startColumnIndex: 0,
                endColumnIndex: 3,
              },
              cell: {
                userEnteredFormat: {
                  wrapStrategy: "WRAP",
                  verticalAlignment: "TOP",
                  borders: {
                    top: {
                      style: "SOLID",
                      color: { red: 0, green: 0, blue: 0 },
                    },
                    bottom: {
                      style: "SOLID",
                      color: { red: 0, green: 0, blue: 0 },
                    },
                    left: {
                      style: "SOLID",
                      color: { red: 0, green: 0, blue: 0 },
                    },
                    right: {
                      style: "SOLID",
                      color: { red: 0, green: 0, blue: 0 },
                    },
                  },
                },
              },
              fields:
                "userEnteredFormat.wrapStrategy,userEnteredFormat.verticalAlignment,userEnteredFormat.borders",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 2,
                startColumnIndex: 0,
                endColumnIndex: 3,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 1,
                    green: 0.97,
                    blue: 0.9,
                  },
                  textFormat: {
                    bold: true,
                    fontSize: 12,
                  },
                  verticalAlignment: "MIDDLE",
                },
              },
              fields:
                "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat,userEnteredFormat.verticalAlignment",
            },
          },
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 3,
                endRowIndex: 4,
                startColumnIndex: 0,
                endColumnIndex: 3,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.86,
                    green: 0.93,
                    blue: 1,
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 0.07,
                      green: 0.12,
                      blue: 0.22,
                    },
                    bold: true,
                  },
                },
              },
              fields:
                "userEnteredFormat.backgroundColor,userEnteredFormat.textFormat",
            },
          },
        ],
      }),
    }
  );
  const formatData = await formatRes.json();

  if (!formatRes.ok) {
    console.error("Google Sheets format error:", formatData);
    throw new Error("스프레드시트 서식 설정에 실패했습니다.");
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

  await moveSpreadsheetToFolder(accessToken, spreadsheet.id);
  await writeSpreadsheetValues(accessToken, spreadsheet.id, body, submittedDate);
  await formatSpreadsheet(accessToken, spreadsheet.id, spreadsheet.sheetId);
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
