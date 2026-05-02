/* eslint-disable @typescript-eslint/no-unused-vars */

const LONG_MESSAGE_ROW = 19;

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const expectedSecret =
      PropertiesService.getScriptProperties().getProperty(
        "CONSULTATION_SCRIPT_SECRET"
      );

    if (expectedSecret && payload.secret !== expectedSecret) {
      throw new Error("Apps Script secret이 일치하지 않습니다.");
    }

    if (!payload.title || !Array.isArray(payload.rows)) {
      throw new Error("스프레드시트 생성 데이터가 올바르지 않습니다.");
    }

    const spreadsheet = SpreadsheetApp.create(payload.title);
    const sheet = spreadsheet.getSheets()[0];

    sheet.setName(payload.sheetName || "상담신청");
    sheet
      .getRange(1, 1, payload.rows.length, 3)
      .setValues(payload.rows)
      .setWrap(true)
      .setVerticalAlignment("top")
      .setBorder(true, true, true, true, true, true, "#000000", SpreadsheetApp.BorderStyle.SOLID);

    sheet.getRange("A2:C2").merge();
    sheet.setColumnWidth(1, 88);
    sheet.setColumnWidth(2, 360);
    sheet.setColumnWidth(3, 980);
    sheet.setRowHeight(1, 36);
    sheet.setRowHeight(2, 42);
    sheet.setRowHeight(4, 32);
    sheet.setRowHeight(LONG_MESSAGE_ROW, 760);
    sheet.setFrozenRows(4);

    sheet
      .getRange("A1:C2")
      .setBackground("#FFF7E6")
      .setFontWeight("bold")
      .setVerticalAlignment("middle");

    sheet
      .getRange("A4:C4")
      .setBackground("#DBEAFE")
      .setFontColor("#111827")
      .setFontWeight("bold");

    sheet.getRange(LONG_MESSAGE_ROW, 3).setBackground("#FFF7ED");

    const file = DriveApp.getFileById(spreadsheet.getId());
    file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);

    if (payload.folderId) {
      const folder = DriveApp.getFolderById(payload.folderId);
      folder.addFile(file);

      try {
        DriveApp.getRootFolder().removeFile(file);
      } catch (error) {
        console.log(error);
      }
    }

    SpreadsheetApp.flush();

    return jsonResponse({
      success: true,
      spreadsheet: {
        id: spreadsheet.getId(),
        title: spreadsheet.getName(),
        url: spreadsheet.getUrl(),
      },
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
