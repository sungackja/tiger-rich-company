# 상담 신청 스프레드시트 저장 상태

## 현재 운영 상태

2026년 5월 2일 기준, 상담 신청 API는 정상 작동합니다.

운영 사이트 API 테스트 결과:

```txt
파일명: 260502_테스트한승연_5678
저장 방식: Apps Script
결과: 성공
```

현재 저장 흐름은 다음과 같습니다.

```txt
사용자 상담 신청
↓
사이트 API가 신청 내용을 검증
↓
Google 저장 방식들을 각각 시도
↓
하나라도 성공하면 신청 성공 처리
↓
생성된 스프레드시트 링크를 Telegram으로 전송
```

## Google 저장 방식

현재 코드는 두 가지 저장 방식을 모두 지원합니다.

```txt
1. Google 서비스 계정 방식
2. Google Apps Script 웹앱 방식
```

둘 중 하나라도 성공하면 신청은 성공 처리됩니다.

둘 다 성공하면 Telegram에 링크가 2개 전송됩니다.

하나만 성공하면 성공한 링크가 전송되고, 실패한 방식의 에러도 함께 표시됩니다.

## 현재 테스트 결과

현재 실제 운영 테스트에서는 다음 상태입니다.

```txt
Apps Script 방식: 정상 작동
서비스 계정 방식: Drive quota 문제로 실패
사이트 신청 접수: 성공 처리됨
Telegram 링크 전송: 유지됨
```

서비스 계정 방식의 현재 에러:

```txt
The user's Drive storage quota has been exceeded.
```

이 에러는 사이트 코드 문제가 아니라 Google 서비스 계정의 Drive 저장소 quota 문제입니다.

## 운영 권장 설정

실운영에서 Telegram에 서비스 계정 실패 메시지가 계속 뜨는 것이 싫다면, Vercel에서 아래 환경변수를 일시적으로 제거하는 것을 권장합니다.

```txt
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
```

이 두 값을 제거하면 서비스 계정 방식은 시도하지 않고, Apps Script 방식만 사용합니다.

나중에 서비스 계정 quota 문제를 해결하면 다시 넣으면 됩니다.

## 유지해야 하는 환경변수

Apps Script 방식 운영을 위해 필요한 값:

```txt
GOOGLE_APPS_SCRIPT_URL
GOOGLE_APPS_SCRIPT_SECRET
GOOGLE_DRIVE_FOLDER_ID
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

`GOOGLE_APPS_SCRIPT_SECRET` 대신 `CONSULTATION_SCRIPT_SECRET` 이름으로 넣어도 서버가 인식합니다.

로컬 테스트에도 아래 값이 필요합니다.

```txt
GOOGLE_DRIVE_FOLDER_ID=1cr-loy7Vts8nwV09aIpBOTkKcb3enQL0
```

## Apps Script 배포 확인

Apps Script 웹앱 URL은 반드시 아래 형태여야 합니다.

```txt
https://script.google.com/macros/s/.../exec
```

배포 설정:

```txt
실행 사용자: 나
액세스 권한: 모든 사용자
```

코드 수정 또는 권한 승인 후에는 반드시 `새 버전`으로 다시 배포해야 합니다.

## 테스트로 생성된 파일

테스트 과정에서 `tiger-home-test` 폴더에 생성된 테스트 스프레드시트는 삭제해도 됩니다.

파일명 예시:

```txt
260502_테스트한승연_5678
```

## 관련 파일

사이트 API:

```txt
app/api/consultations/route.ts
```

Apps Script 복사용 코드:

```txt
docs/google-apps-script-consultation.js
```

## 최근 관련 커밋

```txt
f29ee9f Use character filter for spreadsheet titles
72db994 Preserve Korean names in spreadsheet titles
6707b8d Add Apps Script diagnostics
a734e9d Improve Apps Script consultation errors
c64b6fa Support dual Google spreadsheet storage
```
