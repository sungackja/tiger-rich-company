# Tiger Rich Company / 어부야몰 상담 신청 사이트 인수인계 문서

## 1. 프로젝트 개요

이 프로젝트는 부동산 상담 상품을 소개하고, 사용자가 상담 신청을 남기면 관리자에게 알림이 가는 상담 예약 웹사이트입니다.

기존 네이버폼/구글폼 같은 외부 폼을 대체하여, 자체 웹사이트에서 상담 신청, 관리자 확인, 향후 결제 및 예약 관리까지 확장하는 것을 목표로 합니다.

현재 핵심 흐름은 다음과 같습니다.

```txt
사용자 사이트 방문
↓
상담 상품 및 안내 확인
↓
상담 신청 페이지에서 정보 입력
↓
Telegram 알림 전송
↓
Supabase에 상담 신청 저장
↓
관리자 페이지에서 신청 내역 확인
```

## 2. 현재 저장소 및 배포 구조

GitHub 저장소:

```txt
https://github.com/sungackja/tiger-rich-company
```

Vercel 배포 주소:

```txt
https://tiger-rich-company.vercel.app/
```

현재 배포 방식:

```txt
로컬에서 코드 수정
↓
git add .
↓
git commit
↓
git push origin main
↓
Vercel이 GitHub main 브랜치 변경 감지
↓
자동 빌드 및 재배포
```

Vercel은 GitHub 저장소와 연결되어 있으며, `main` 브랜치에 push하면 자동 배포되는 구조입니다.

## 3. 기술 스택

```txt
Next.js App Router
TypeScript
Tailwind CSS
Vercel
Supabase
Telegram Bot API
TossPayments SDK
GitHub
```

현재 주요 버전:

```txt
Next.js 16.2.3
React 19.2.4
```

## 4. 로컬 개발 환경

Windows + PowerShell 기준입니다.

프로젝트 경로:

```txt
C:\Users\hanjj\OneDrive\Desktop\부동산\타이거 사이트\tiger-rich-company
```

확인 명령어:

```powershell
node -v
npm -v
git --version
```

프로젝트 실행:

```powershell
cd "C:\Users\hanjj\OneDrive\Desktop\부동산\타이거 사이트\tiger-rich-company"
npm run dev
```

빌드 확인:

```powershell
npm run build
```

현재 `package.json`의 build 명령은 다음처럼 설정되어 있습니다.

```json
"build": "next build --webpack"
```

이유:

```txt
Next.js 16의 기본 Turbopack 빌드가 Windows / Codex 환경에서 권한 문제를 일으킨 적이 있어,
안정적인 webpack 빌드 모드로 고정했습니다.
```

## 5. 주요 폴더 구조

```txt
app/
  layout.tsx
  page.tsx
  globals.css

  components/
    Navbar.tsx
    Footer.tsx

  consult/
    page.tsx
    complete/
      page.tsx

  admin/
    layout.tsx
    page.tsx
    AdminLogoutButton.tsx
    StatusSelect.tsx
    login/
      page.tsx
      AdminLoginClient.tsx

  api/
    telegram/
      route.ts
    admin/
      login/
        route.ts
      logout/
        route.ts
      consultations/
        [id]/
          route.ts
    payments/
      confirm/
        route.ts

  payments/
    page.tsx
    success/
      page.tsx
    fail/
      page.tsx

lib/
  supabase.ts
  supabase-admin.ts
```

## 6. 최근 완료된 작업

최근 작업에서 다음을 정리했습니다.

```txt
npm run build 통과
Next.js App Router layout 오류 수정
app/admin/layout.tsx 추가
Footer/Navbar import/export 안정화
상담 신청 페이지 기능 복구 및 정리
상담 완료 페이지 정리
Telegram 알림 API 정리
Supabase service role key 서버 전용 처리
관리자 로그인 및 관리자 페이지 안정화
TossPayments 타입 오류 정리
오픈채팅 버튼 링크 수정
```

최근 안정화 커밋:

```txt
2986df4 fix: stabilize build and consultation flow
```

푸시 완료 브랜치:

```txt
main
```

## 7. 상담 신청 페이지

파일:

```txt
app/consult/page.tsx
```

기능:

```txt
이름 입력
연락처 입력
상담 상품 선택
상담 희망 날짜 1~3순위 선택
상담 희망 시간 1시간 단위 드롭다운 선택
상담 내용 입력
결제 방식 선택
제출 시 /api/telegram 호출
성공 시 /consult/complete 이동
```

요구사항 반영 상태:

```txt
과거 날짜 선택 불가
시간 선택 드롭다운
1시간 단위
완료 화면 제공
카카오톡 오픈채팅 링크 제공
5초 후 홈으로 자동 이동
Telegram 알림 유지
Supabase 저장 처리
```

## 8. 상담 완료 페이지

파일:

```txt
app/consult/complete/page.tsx
```

기능:

```txt
상담 신청 완료 메시지 표시
카카오톡 오픈채팅 바로가기 버튼 표시
5초 후 홈으로 자동 이동
다시 상담 신청하기 버튼 제공
```

카카오 오픈채팅 링크:

```txt
https://open.kakao.com/o/gbBMu9Lh
```

## 9. 홈 페이지

파일:

```txt
app/page.tsx
```

역할:

```txt
사이트 메인 랜딩 페이지
부동산 상담 소개
상담 신청 CTA
오픈채팅 CTA
상담 서비스 안내
상담 진행 절차 안내
```

홈 화면의 오픈채팅 버튼은 아래 링크로 통일했습니다.

```txt
https://open.kakao.com/o/gbBMu9Lh
```

버튼 문구:

```txt
오픈채팅 바로가기
```

## 10. Telegram 알림 API

파일:

```txt
app/api/telegram/route.ts
```

역할:

```txt
상담 신청 데이터를 받아서
1. 필수 항목 검증
2. Supabase 저장
3. Telegram 메시지 전송
4. 성공 응답 반환
```

필요 환경변수:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Telegram 메시지에 포함되는 정보:

```txt
이름
연락처
상담 상품
1순위 일정
2순위 일정
3순위 일정
결제 방식
상담 내용
```

주의:

```txt
Telegram 환경변수가 없으면 알림은 전송되지 않지만,
Supabase 저장과 신청 흐름은 계속 동작하도록 구성되어 있습니다.
```

## 11. Supabase 연동

파일:

```txt
lib/supabase.ts
lib/supabase-admin.ts
```

역할:

```txt
lib/supabase.ts
- 클라이언트용 Supabase 공개 key 기반 설정

lib/supabase-admin.ts
- 서버 전용 service role key 기반 설정
- API route, 관리자 페이지 등 서버 영역에서만 사용
```

필요 환경변수:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

중요 보안 규칙:

```txt
SUPABASE_SERVICE_ROLE_KEY는 절대 클라이언트 컴포넌트에서 사용하면 안 됩니다.
반드시 서버 컴포넌트 또는 API route에서만 사용해야 합니다.
```

`supabase-admin.ts`는 환경변수가 없을 때 빌드가 죽지 않도록 방어 처리되어 있습니다.

## 12. 관리자 페이지

경로:

```txt
/admin/login
/admin
```

파일:

```txt
app/admin/layout.tsx
app/admin/login/page.tsx
app/admin/login/AdminLoginClient.tsx
app/admin/page.tsx
app/admin/AdminLogoutButton.tsx
app/admin/StatusSelect.tsx
```

관리자 로그인 흐름:

```txt
/admin/login 접속
↓
비밀번호 입력
↓
/api/admin/login 호출
↓
성공 시 admin_auth 쿠키 저장
↓
/admin 이동
```

필요 환경변수:

```env
ADMIN_PASSWORD=
ADMIN_COOKIE_NAME=admin_auth
```

`ADMIN_COOKIE_NAME`은 없으면 기본값으로 `admin_auth`를 사용합니다.

관리자 보호 방식:

```txt
proxy.ts에서 /admin 경로 접근 시 쿠키를 확인합니다.
쿠키가 없으면 /admin/login으로 리다이렉트합니다.
```

## 13. 관리자 API

로그인:

```txt
app/api/admin/login/route.ts
```

로그아웃:

```txt
app/api/admin/logout/route.ts
```

상담 상태 변경:

```txt
app/api/admin/consultations/[id]/route.ts
```

허용 상태값:

```txt
pending
confirmed
completed
cancelled
```

## 14. 결제 기능

파일:

```txt
app/payments/page.tsx
app/payments/success/page.tsx
app/payments/fail/page.tsx
app/api/payments/confirm/route.ts
```

사용 SDK:

```txt
@tosspayments/tosspayments-sdk
```

필요 환경변수:

```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
```

현재 상태:

```txt
빌드는 통과하도록 정리되어 있습니다.
다만 실제 결제 운영 전에는 TossPayments 상점 설정,
successUrl/failUrl,
결제 승인 API,
금액 검증,
주문 데이터 저장 로직을 추가 검증해야 합니다.
```

주의:

```txt
현재 결제 기능은 테스트 성격이 강합니다.
운영 결제 전에는 반드시 TossPayments 공식 문서 기준으로 재검증해야 합니다.
```

## 15. Vercel 환경변수 체크리스트

Vercel 프로젝트 Settings → Environment Variables에 아래 값들이 들어가 있어야 합니다.

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

ADMIN_PASSWORD=
ADMIN_COOKIE_NAME=admin_auth

NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=https://tiger-rich-company.vercel.app
```

필수 우선순위:

```txt
1순위:
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
ADMIN_PASSWORD

2순위:
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

3순위:
NEXT_PUBLIC_TOSS_CLIENT_KEY
TOSS_SECRET_KEY
NEXT_PUBLIC_SITE_URL
```

## 16. 배포 방법

로컬에서 수정 후:

```powershell
npm run build
git status
git add .
git commit -m "작업 내용"
git push origin main
```

그 후:

```txt
Vercel이 GitHub main 브랜치 변경을 감지
자동으로 npm install / npm run build 실행
성공하면 실제 사이트에 반영
```

배포 확인:

```txt
Vercel Dashboard → tiger-rich-company 프로젝트 → Deployments
```

## 17. GitHub Actions와 Vercel의 역할 구분

현재 프로젝트는 GitHub Actions가 필수는 아닙니다.

Vercel:

```txt
웹사이트 배포 전문
GitHub push 감지
Next.js 빌드
배포 URL 생성
HTTPS / CDN 처리
```

GitHub Actions:

```txt
범용 자동화 도구
테스트 실행
코드 검사
백업
알림
배포 전 검증
스케줄 작업
```

현재 구조에서는:

```txt
GitHub push → Vercel 자동 배포
```

만으로 충분합니다.

나중에 필요하면 GitHub Actions를 붙여서:

```txt
push 전 npm run build 검사
lint 검사
Supabase 백업
Telegram 배포 알림
```

등을 추가할 수 있습니다.

## 18. 과거에 발생했던 주요 문제와 해결

### 1. `npm` 인식 안 됨

원인:

```txt
Node.js PATH 미설정
```

해결:

```txt
Node.js LTS 설치
C:\Program Files\nodejs\ PATH 등록
PowerShell 재시작
```

확인:

```powershell
node -v
npm -v
```

### 2. PowerShell npm 실행 정책 오류

오류:

```txt
npm.ps1 파일을 로드할 수 없습니다.
이 시스템에서 스크립트를 실행할 수 없습니다.
```

해결:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

또는 임시 실행:

```powershell
npm.cmd run build
```

### 3. Git 인식 안 됨

원인:

```txt
Git PATH 미반영
```

해결:

```txt
Git for Windows 설치
설치 옵션에서 command line 사용 가능하도록 설정
PowerShell 재시작
```

확인:

```powershell
git --version
```

### 4. Next.js Turbopack 권한 문제

오류:

```txt
TurbopackInternalError
Access is denied
```

해결:

```txt
package.json build 명령을 next build --webpack으로 변경
```

현재 설정:

```json
"build": "next build --webpack"
```

### 5. 한글이 깨져 보이는 문제

상황:

```txt
PowerShell에서 파일 내용을 출력하면 한글이 깨져 보이는 경우가 있었음
```

확인 기준:

```txt
PowerShell 출력만 보고 파일이 깨졌다고 판단하지 말 것.
브라우저 렌더링, UTF-8 파일 인코딩, 빌드 결과 기준으로 확인할 것.
```

## 19. 새 프로젝트로 이관할 때 권장 순서

1. 새 프로젝트 생성

```txt
Next.js App Router
TypeScript
Tailwind CSS
```

2. 기존 핵심 파일 복사

```txt
app/
lib/
package.json의 dependencies
```

3. 환경변수 이관

```txt
.env.local
Vercel Environment Variables
```

4. 로컬 빌드 확인

```powershell
npm install
npm run build
```

5. GitHub 저장소 연결

```powershell
git init
git remote add origin 새_저장소_URL
git add .
git commit -m "initial migration"
git push origin main
```

6. Vercel 새 프로젝트 생성 후 GitHub 저장소 연결

7. Vercel에서 환경변수 입력

8. 첫 배포 확인

## 20. 현재 안정 상태 요약

현재 프로젝트는 다음 상태입니다.

```txt
로컬 npm run build 통과
GitHub main push 가능한 상태
Vercel 자동 배포 가능한 상태
상담 신청 페이지 정상화
관리자 페이지 정상화
Telegram 알림 API 유지
Supabase 서버 전용 key 처리
오픈채팅 링크 수정 완료
TossPayments 빌드 오류 정리
```

최근 배포 반영 대상 커밋:

```txt
2986df4 fix: stabilize build and consultation flow
```

오픈채팅 최종 링크:

```txt
https://open.kakao.com/o/gbBMu9Lh
```

## 21. 다음 작업 추천

우선순위는 다음과 같습니다.

```txt
1. Vercel 배포 성공 여부 확인
2. 실제 상담 신청 테스트
3. Telegram 알림 수신 테스트
4. Supabase consultations 테이블 저장 확인
5. 관리자 로그인 및 목록 확인
6. TossPayments 실제 결제 테스트 여부 결정
7. 디자인 문구와 브랜드 톤 다듬기
8. 실제 전화번호 / 이메일 / 사업자 정보 입력
```

운영 전 체크:

```txt
상담 신청 시 개인정보 수집 동의 추가
관리자 비밀번호 강화
Supabase RLS 정책 점검
Telegram 토큰 노출 여부 점검
Vercel 환경변수 production/development 구분 확인
결제 기능 운영 여부 결정
```
