# API 연동 작업 정리

## 1. 수정한 파일

- `src/services/api.ts`
  - `fetch` 기반 공통 API 클라이언트와 API 응답 타입을 추가했습니다.
  - 모든 요청에 `credentials: 'include'`를 적용해 Spring Security 세션 쿠키(`JSESSIONID`)가 포함되도록 했습니다.
  - API base URL은 `VITE_API_BASE_URL` 환경변수로 분리했습니다.
- `src/services/portfolioMapper.ts`
  - API 필드명과 화면 표시값을 연결하는 변환 함수를 추가했습니다.
  - 카테고리, 랭킹 기간, 사용자 권한, 날짜, 기술 스택 표시값을 변환합니다.
- `src/App.tsx`
  - hash 라우팅에서 query 형태가 붙어도 화면 분기가 깨지지 않도록 보정했습니다.
- `src/widgets/header/DashboardHeader.tsx`
  - 헤더 사용자 이름/이니셜을 `/api/users/me` 응답으로 표시하도록 연결했습니다.
- `src/pages/auth/LoginPage/index.tsx`
  - 로그인 폼을 `/api/auth/login`에 연결했습니다.
  - 최초 로그인(`firstLogin: true`)이면 회원가입 화면으로 이동합니다.
- `src/pages/auth/SignUpPage/index.tsx`
  - 회원가입 폼을 `/api/auth/register`에 연결했습니다.
  - 학번 9자리 검증과 API 오류 메시지 표시를 추가했습니다.
- `src/pages/dashboard/MainDashboardPage/index.tsx`
  - 메인 배너, 인기 포트폴리오, 최근 등록 포트폴리오 데이터를 실제 API로 교체했습니다.
- `src/pages/portfolio/PortfolioBoardPage/index.tsx`
  - 포트폴리오 목록, 카테고리 필터, 페이지네이션을 `/api/portfolios`에 연결했습니다.
- `src/pages/portfolio/PortfolioDetailPage/index.tsx`
  - 상세 조회, 공감 토글, 삭제를 실제 API로 연결했습니다.
- `src/pages/portfolio/_components/PortfolioFormPage.tsx`
  - 포트폴리오 작성/수정, 이미지 업로드, 참여자 검색을 실제 API로 연결했습니다.
  - 수정 모드 진입 시 상세 데이터를 불러와 폼에 미리 채웁니다.
- `src/pages/ranking/RankingAwardsPage/index.tsx`
  - 랭킹 목록과 기간 필터를 `/api/portfolios/ranking`에 연결했습니다.
- `src/pages/user/MyPage/index.tsx`
  - 내 프로필과 내 포트폴리오 목록을 실제 API로 연결했습니다.
- `src/pages/user/ProfileEditPage/index.tsx`
  - 프로필 조회와 수정 저장을 실제 API로 연결했습니다.

## 2. 화면별 연결 API

- 로그인 화면
  - `POST /api/auth/login`
- 회원가입 화면
  - `POST /api/auth/register`
- 공통 헤더
  - `GET /api/users/me`
- 메인 대시보드
  - `GET /api/portfolios/top`
  - `GET /api/portfolios/popular`
  - `GET /api/portfolios?sort=LATEST&page=0&size=6`
- 포트폴리오 게시판
  - `GET /api/portfolios`
- 포트폴리오 상세
  - `GET /api/portfolios/{id}`
  - `POST /api/portfolios/{id}/likes`
  - `DELETE /api/portfolios/{id}`
- 포트폴리오 작성/수정
  - `POST /api/portfolios`
  - `PUT /api/portfolios/{id}`
  - `POST /api/images/upload`
  - `GET /api/users/search`
- 랭킹 화면
  - `GET /api/portfolios/ranking?period=...`
- 마이페이지
  - `GET /api/users/me`
  - `GET /api/users/me/portfolios`
  - `DELETE /api/portfolios/{id}`
- 프로필 수정
  - `GET /api/users/me`
  - `PATCH /api/users/me`

## 3. mock 데이터에서 실제 API 데이터로 변경한 부분

- 메인 대시보드의 배너 슬라이드, 인기 포트폴리오, 최근 등록 포트폴리오 mock 배열을 API 응답으로 교체했습니다.
- 포트폴리오 게시판의 하드코딩 목록을 API 페이지네이션 응답으로 교체했습니다.
- 랭킹 TOP 3 카드와 랭킹 테이블의 mock 데이터를 API 응답 순서 기반 데이터로 교체했습니다.
- 상세 화면의 제목, 요약, 카테고리, 기술 스택, 참여자, 공감 수, 상세 설명을 API 응답으로 교체했습니다.
- 마이페이지의 사용자 프로필과 내 포트폴리오 목록 mock 데이터를 API 응답으로 교체했습니다.
- 프로필 수정 화면의 고정 사용자 값을 `/api/users/me` 응답으로 교체했습니다.
- 작성/수정 폼의 수정 모드 기본값을 상세 조회 API 응답으로 교체했습니다.

## 4. 추가로 백엔드와 확인해야 할 부분

- 프론트와 백엔드 포트가 다를 경우 CORS에서 `credentials: true`와 정확한 origin 허용이 필요합니다.
- 세션 쿠키 방식이므로 운영 환경에서 쿠키의 `SameSite`, `Secure`, 도메인 설정을 확인해야 합니다.
- 마이페이지의 내 포트폴리오 목록 응답에는 삭제 권한 필드가 없어, 삭제 버튼 클릭 시 권한 없으면 서버 오류 메시지를 표시하는 방식으로 처리했습니다.
- 참여자 추가는 현재 검색 결과의 첫 번째 사용자를 추가합니다. 동명이인 선택 UI가 필요하면 별도 선택 목록 API/UX 확인이 필요합니다.
- 상세 화면 이동은 현재 hash 라우터 구조를 유지하기 위해 `sessionStorage`에 선택 포트폴리오 ID를 저장합니다. URL에 ID를 직접 노출하는 라우팅이 필요하면 라우터 구조 변경이 필요합니다.

## 5. 실행 또는 테스트 방법

1. 백엔드 API 주소가 프론트와 다르면 `.env`에 아래 값을 설정합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

2. 프론트 개발 서버를 실행합니다.

```bash
npm run dev
```

3. 검증 명령입니다.

```bash
npm run build
npm run lint
```

현재 작업 후 `npm run build`, `npm run lint` 모두 통과했습니다.

## 참조 문서

- `Reference/사용자 요구사항 정의.md`
- `Reference/API 명세서.md`
- `Reference/DB 테이블 명세서.md`
