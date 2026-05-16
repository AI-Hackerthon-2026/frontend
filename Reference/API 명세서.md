# DevLink 최종 API 명세서 (v2.1)

> **기준 문서**: 사용자 요구사항 정의서 + DB_Schema.md
> **작성일**: 2026.05.17 (v2.1 — 전체 API 테스트 결과 반영)
> **원칙**: 실제 구현 코드 및 테스트 결과 기준으로 최종 확정.

---

## ⚠️ 핵심 설계 결정 사항

<!-- v2.0 원본
| 항목              | 결정 내용                                                                              | 근거                                  |
| ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------- |
| 인증 방식         | **커스텀 portalId 기반 인증** + Spring Security 세션 (포털 SSO 미연동, 향후 확장 예정) | 확장 가능 설계                        |
| 세션 관리         | JWT ❌ — Spring Security `HttpSession` 기반                                            | 사용자 요청                           |
| 회원가입          | `/api/auth/register` 별도 API를 통해 처리                                              | 백엔드 구현 코드 기준 반영            |
| 사용자 유형       | STUDENT / PROFESSOR / ADMIN (가입 후 변경 불가)                                        | 요구사항 `1.0 사용자 유형`            |
| 기술스택 입력     | 사용자 자유 입력 → skills 테이블 자동 등록                                             | `DB_Schema.md` skills 테이블 제약조건 |
| 포트폴리오 참여자 | `portfolio_participants` 테이블로 권한 관리                                            | `DB_Schema.md` 5번 테이블             |
| 소프트 삭제       | is_deleted 플래그로 처리                                                               | `DB_Schema.md` portfolios 테이블      |
-->

| 항목              | 결정 내용                                                                              | 근거                                  |
| ----------------- | -------------------------------------------------------------------------------------- | ------------------------------------- |
| 인증 방식         | **가천대 포털 SSO 연동** (Jsoup 크롤링) + Spring Security 세션                        | PortalAuthService 구현 완료           |
| 세션 관리         | JWT ❌ — Spring Security `HttpSession` 기반                                            | 사용자 요청                           |
| 회원가입 흐름     | login → `firstLogin: true` → register (portalId는 세션에서 자동 전달)                 | AuthService 구현 기준                 |
| 사용자 유형       | STUDENT / PROFESSOR / ADMIN (가입 후 변경 불가)                                        | 요구사항 `1.0 사용자 유형`            |
| 기술스택 입력     | 사용자 자유 입력 → skills 테이블 자동 등록                                             | `DB_Schema.md` skills 테이블 제약조건 |
| 포트폴리오 참여자 | `portfolio_participants` 테이블로 권한 관리                                            | `DB_Schema.md` 5번 테이블             |
| 소프트 삭제       | is_deleted 플래그로 처리                                                               | `DB_Schema.md` portfolios 테이블      |
| 이미지 업로드     | 서버 로컬 저장 (`/image/**`) — `POST /api/images/upload`로 URL 반환 후 포트폴리오에 사용 | 로컬 이미지 업로드 가이드 반영        |

---

## 📋 전체 API 목록

### 인증 (Auth)

| #   | 메서드 | URI                  | 기능                 | 인증 |
| --- | ------ | -------------------- | -------------------- | ---- |
| 1   | POST   | `/api/auth/login`    | 포털 SSO 로그인      | ❌   |
| 2   | POST   | `/api/auth/register` | 최초 회원 등록       | ❌ (임시 세션 필요) |
| 3   | POST   | `/api/auth/logout`   | 로그아웃             | ✅   |

### 사용자 (User / 마이페이지)

| #   | 메서드 | URI                        | 기능                        | 인증 |
| --- | ------ | -------------------------- | --------------------------- | ---- |
| 4   | GET    | `/api/users/me`            | 내 프로필 조회              | ✅   |
| 5   | PATCH  | `/api/users/me`            | 내 프로필 수정              | ✅   |
| 6   | GET    | `/api/users/me/portfolios` | 내 포트폴리오 목록          | ✅   |
| 7   | GET    | `/api/users/search`        | 사용자 검색 (참여자 추가용) | ✅   |

### 포트폴리오 (Portfolio)

| #   | 메서드 | URI                       | 기능                                         | 인증               |
| --- | ------ | ------------------------- | -------------------------------------------- | ------------------ |
| 8   | GET    | `/api/portfolios`         | 전체 목록 (카테고리/기술 필터, 페이지네이션) | ❌ (로그인 시 liked 반영) |
| 9   | POST   | `/api/portfolios`         | 포트폴리오 작성                              | ✅                 |
| 10  | GET    | `/api/portfolios/top`     | 메인 배너 — 기간별 TOP 1 × 최대 3           | ❌                 |
| 11  | GET    | `/api/portfolios/popular` | 메인 인기 포트폴리오 (누적 공감 TOP 3)       | ❌                 |
| 12  | GET    | `/api/portfolios/ranking` | 랭킹 목록 (기간 필터)                        | ❌ (로그인 시 liked 반영) |
| 13  | GET    | `/api/portfolios/{id}`    | 상세 조회                                    | ❌ (로그인 시 liked/canEdit 반영) |
| 14  | PUT    | `/api/portfolios/{id}`    | 수정                                         | ✅ (can_edit 참여자) |
| 15  | DELETE | `/api/portfolios/{id}`    | 삭제 (소프트)                                | ✅ (is_owner 작성자) |

### 공감 (Like)

| #   | 메서드 | URI                          | 기능      | 인증 |
| --- | ------ | ---------------------------- | --------- | ---- |
| 16  | POST   | `/api/portfolios/{id}/likes` | 공감 토글 | ✅   |

### 기술스택 (Skills)

| #   | 메서드 | URI           | 기능                        | 인증 |
| --- | ------ | ------------- | --------------------------- | ---- |
| 17  | GET    | `/api/skills` | 전체 기술 목록 (자동완성용) | ❌   |

### 이미지 (Image)

| #   | 메서드 | URI                    | 기능                        | 인증 |
| --- | ------ | ---------------------- | --------------------------- | ---- |
| 18  | POST   | `/api/images/upload`   | 이미지 업로드 (로컬 저장)   | ✅   |
| 19  | GET    | `/image/{filename}`    | 업로드된 이미지 서빙        | ❌   |

---

## 1. 인증 API (Auth)

### POST /api/auth/login

**포털 SSO 로그인**

가천대 포털 아이디/비밀번호로 SSO 인증 후 Spring Security 세션을 생성합니다.

**서비스 내부 처리 흐름**:

```text
1. PortalAuthService로 포털 SSO 인증 (Jsoup 크롤링)
   ├─ 인증 성공 → DB에서 portalId 조회
   │   ├─ 사용자 존재 → Spring Security 세션 생성 → firstLogin: false 반환
   │   └─ 사용자 없음 → 임시 세션에 portalId 저장 → firstLogin: true 반환
   └─ 인증 실패 → 401 에러
```

Request Body:

```json
{
  "portalId": "gachon_user123",
  "password": "portalPassword"
}
```

| 필드     | 타입   | 필수 | 설명                                        |
| -------- | ------ | ---- | ------------------------------------------- |
| portalId | String | ✅   | 학교 포털 아이디                            |
| password | String | ✅   | 학교 포털 비밀번호 (DB에 저장되지 않음)     |

**Response `200 OK` — 기존 회원 로그인**

```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "id": 1,
    "name": "조하겸",
    "studentId": "201932051",
    "userLevel": "STUDENT",
    "firstLogin": false
  }
}
```

<!-- v2.0 원본 응답 예시
```json
{
  "success": true,
  "message": "로그인에 성공했습니다.",
  "data": {
    "id": 1,
    "name": "홍길동",
    "studentId": "202300001",
    "userLevel": "STUDENT"
  }
}
```
-->

**Response `200 OK` — 최초 로그인 (`firstLogin: true`)**

```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "id": null,
    "name": null,
    "studentId": null,
    "userLevel": null,
    "firstLogin": true
  }
}
```

> `firstLogin: true` 수신 시 `/api/auth/register` 호출 필요. 서버가 임시 세션에 portalId를 저장합니다.
> 세션 쿠키 `JSESSIONID`가 `Set-Cookie` 헤더로 응답됩니다.

**예외 응답**:

| 상황                                  | HTTP | 메시지                                      |
| ------------------------------------- | ---- | ------------------------------------------- |
| 포털 인증 실패 (아이디/비밀번호 오류) | 401  | "아이디 또는 비밀번호가 올바르지 않습니다." |
| 포털 서버 연결 실패                   | 500  | "포털 서버에 연결할 수 없습니다."           |

---

### POST /api/auth/register

**최초 회원 등록**

`/api/auth/login`에서 `firstLogin: true`를 받은 직후에만 호출 가능합니다.
portalId는 임시 세션에서 자동으로 처리되므로 요청 바디에 포함하지 않습니다.

<!-- v2.0 원본 Register 설명
신규 회원의 계정을 생성합니다. 회원가입 후 클라이언트는 `/api/auth/login`을 재호출하여 세션을 발급받아야 합니다.

Request Body:
```json
{
  "portalId": "gachon_user123",
  "studentId": "202300001",
  "name": "홍길동",
  "grade": 3,
  "githubLink": "https://github.com/hong",
  "userLevel": "STUDENT"
}
```

| 필드       | 타입    | 필수 여부 | 설명                                                  |
| ---------- | ------- | --------- | ----------------------------------------------------- |
| portalId   | String  | ✅ 필수   | **학교 포털 실제 아이디** (학번과 다름)               |
| studentId  | String  | ✅ 필수   | **학번** — 9자리 숫자                                 |
| name       | String  | ✅ 필수   | 이름                                                  |
| grade      | Integer | ✅ 필수   | 학년 (1~4)                                            |
| githubLink | String  | ❌ 선택   | GitHub 프로필 링크 (URL 형식 검증)                    |
| userLevel  | String  | ✅ 필수   | `STUDENT` / `PROFESSOR` / `ADMIN` (기본값: `STUDENT`) |
-->

Request Body:

```json
{
  "studentId": "202300001",
  "name": "홍길동",
  "grade": 3,
  "githubLink": "https://github.com/hong",
  "userLevel": "STUDENT"
}
```

| 필드       | 타입    | 필수 | 설명                                                  |
| ---------- | ------- | ---- | ----------------------------------------------------- |
| studentId  | String  | ✅   | 학번 — 정확히 9자리                                   |
| name       | String  | ✅   | 이름                                                  |
| grade      | Integer | ✅   | 학년 (1~4)                                            |
| githubLink | String  | ❌   | GitHub 프로필 링크 (형식: `https://github.com/...`)   |
| userLevel  | UserLevel | ✅ | `STUDENT` / `PROFESSOR` / `ADMIN` (기본값: `STUDENT`) |

> ⚠️ **선행 조건**: 직전 `/api/auth/login` 응답에서 `firstLogin: true`를 받아야 합니다. 임시 세션이 만료되었거나 없으면 401 반환.

**Response `201 Created`**

```json
{
  "success": true,
  "message": "가입이 완료되었습니다.",
  "data": {
    "id": 2,
    "name": "홍길동",
    "studentId": "202300001",
    "userLevel": "STUDENT",
    "firstLogin": false
  }
}
```

**예외 응답**:

<!-- v2.0 원본 예외
| 상황               | HTTP | 메시지                                 |
| 비밀번호 형식 오류 | 400  | "비밀번호는 8자 이상이어야 합니다."    |
-->

| 상황                              | HTTP | 메시지                                 |
| --------------------------------- | ---- | -------------------------------------- |
| 임시 세션 없음 (login 선행 없음)  | 401  | "먼저 로그인을 진행해주세요."          |
| 중복된 portalId                   | 409  | "이미 가입된 포털 아이디입니다."       |
| 중복된 studentId                  | 409  | "이미 사용 중인 학번입니다."           |
| 학번 9자리 아닌 경우              | 400  | "학번은 9자리 숫자여야 합니다."        |
| GitHub 링크 형식 오류             | 400  | "올바른 GitHub 링크 형식을 입력해주세요." |

---

### POST /api/auth/logout

**로그아웃**

Spring Security 로그아웃 핸들러가 서버 세션을 무효화하고 `JSESSIONID` 쿠키를 만료시킵니다.

Response `200 OK`:

```json
{ "success": true, "message": "로그아웃되었습니다.", "data": null }
```

<!-- v2.0 원본 메시지: "로그아웃 되었습니다." -->

---

## 2. 사용자 API (User / 마이페이지)

### GET /api/users/me

**내 프로필 조회**

Response `200 OK`:

```json
{
  "success": true,
  "message": "프로필 조회 성공",
  "data": {
    "id": 1,
    "name": "조하겸",
    "portalId": "gkrua0703",
    "studentId": "201932051",
    "grade": 4,
    "githubLink": "https://github.com/gkrua0703",
    "userLevel": "STUDENT",
    "createdAt": "2026-05-17T03:01:45.149688"
  }
}
```

<!-- v2.0 원본 응답
```json
{
  "success": true,
  "message": "조회에 성공했습니다.",
  "data": {
    "id": 1,
    "portalId": "gachon_user123",
    "name": "홍길동",
    "studentId": "202300001",
    "grade": 3,
    "githubLink": "https://github.com/hong",
    "userLevel": "STUDENT",
    "createdAt": "2026-05-01T10:00:00"
  }
}
```
-->

---

### PATCH /api/users/me

**내 프로필 수정**

> ⚠️ `portalId`, `studentId`, `userLevel`은 수정 불가

Request Body:

```json
{
  "name": "홍길동",
  "grade": 4,
  "githubLink": "https://github.com/hong-dev"
}
```

| 필드       | 타입    | 필수 | 설명                        |
| ---------- | ------- | ---- | --------------------------- |
| name       | String  | ✅   | 이름                        |
| grade      | Integer | ✅   | 학년 (1~4)                  |
| githubLink | String  | ❌   | GitHub 링크 (`https://github.com/...` 형식) |

Response `200 OK`:

```json
{
  "success": true,
  "message": "프로필 수정 성공",
  "data": {
    "id": 1,
    "name": "홍길동",
    "portalId": "gkrua0703",
    "studentId": "201932051",
    "grade": 4,
    "githubLink": "https://github.com/hong-dev",
    "userLevel": "STUDENT",
    "createdAt": "2026-05-17T03:01:45.149688"
  }
}
```

<!-- v2.0 원본: message "프로필이 수정되었습니다.", portalId/createdAt 미포함 -->

**예외 응답**:

| 상황                  | HTTP | 메시지                                    |
| --------------------- | ---- | ----------------------------------------- |
| name 비어있음         | 400  | "이름은 필수 입력 항목입니다."            |
| GitHub 링크 형식 오류 | 400  | "올바른 GitHub 링크 형식을 입력해주세요." |

---

### GET /api/users/me/portfolios

**내 포트폴리오 목록 조회**

`portfolio_participants`에 등록된 포트폴리오 (작성자 + 참여자 모두 포함), 최신순 반환.

Response `200 OK`:

```json
{
  "success": true,
  "message": "내 포트폴리오 목록 조회 성공",
  "data": [
    {
      "id": 1,
      "projectName": "DevLink API",
      "category": "AUTONOMOUS",
      "summary": "포트폴리오 공유",
      "thumbnailUrl": null,
      "likeCount": 0,
      "skills": ["Java", "Spring Boot", "JPA"],
      "authorName": "조하겸",
      "participantCount": 1,
      "githubLink": "https://github.com/hkjo0703/devlink",
      "deploymentLink": null,
      "startDate": "2026-03-01",
      "endDate": "2026-05-17",
      "createdAt": "2026-05-17T03:03:50.549232",
      "liked": false
    }
  ]
}
```

<!-- v2.0 원본 응답 (필드 차이: isOwner 대신 liked, 전체 포트폴리오 필드 포함)
```json
{
  "success": true,
  "message": "조회에 성공했습니다.",
  "data": [
    {
      "id": 1,
      "projectName": "React 쇼핑몰",
      "likeCount": 15,
      "participantCount": 4,
      "isOwner": true,
      "createdAt": "2026-05-01"
    }
  ]
}
```
-->

---

### GET /api/users/search

**사용자 검색 (참여자 추가용)**

Query Parameters:

<!-- v2.0 원본: 파라미터명 `q`
| q        | String | 검색어 (이름 또는 학번 일부, 최소 1자) |
-->

| 파라미터 | 타입   | 설명                                        |
| -------- | ------ | ------------------------------------------- |
| keyword  | String | 검색어 (이름 또는 학번 일부) — **필수** |

Response `200 OK`:

```json
{
  "success": true,
  "message": "사용자 검색 성공",
  "data": [
    {
      "id": 2,
      "name": "신태훈",
      "studentId": "202135989",
      "userLevel": "STUDENT"
    }
  ]
}
```

> 본인은 결과에서 자동 제외됩니다.

<!-- v2.0 원본 메시지: "조회에 성공했습니다." -->

**예외 응답**:

| 상황     | HTTP | 메시지                          |
| -------- | ---- | ------------------------------- |
| 비로그인 | 401  | "로그인이 필요한 서비스입니다." |

---

## 3. 포트폴리오 API (Portfolio)

### GET /api/portfolios

**포트폴리오 전체 목록 조회**

Query Parameters:

| 파라미터 | 타입    | 설명                                                                      |
| -------- | ------- | ------------------------------------------------------------------------- |
| category | String  | 카테고리 필터 (`GRADUATION` / `P_PROJECT` / `AUTONOMOUS`, 미입력 시 전체) |
| skills   | String  | 기술스택 필터 (쉼표 구분, 예: `React,Spring`)                             |
| sort     | String  | `LATEST`(최신순, 기본값) / `LIKES`(공감 많은 순)                          |
| page     | Integer | 페이지 번호 (0부터 시작, 기본값: 0)                                       |
| size     | Integer | 페이지 당 항목 수 (기본값: 10)                                            |

Response `200 OK`:

```json
{
  "success": true,
  "message": "포트폴리오 목록 조회 성공",
  "data": {
    "content": [
      {
        "id": 1,
        "projectName": "DevLink API",
        "category": "AUTONOMOUS",
        "summary": "포트폴리오 공유",
        "thumbnailUrl": null,
        "likeCount": 0,
        "skills": ["Java", "Spring Boot", "JPA"],
        "authorName": "조하겸",
        "participantCount": 1,
        "githubLink": "https://github.com/hkjo0703/devlink",
        "deploymentLink": null,
        "startDate": "2026-03-01",
        "endDate": "2026-05-17",
        "createdAt": "2026-05-17T03:03:50.549232",
        "liked": false
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalElements": 4,
    "size": 10
  }
}
```

<!-- v2.0 원본: 응답 필드 `isLiked` → 실제는 `liked`. message "조회에 성공했습니다." → "포트폴리오 목록 조회 성공" -->

---

### POST /api/portfolios

**포트폴리오 작성**

Request Body:

```json
{
  "projectName": "React 쇼핑몰 프로젝트",
  "category": "GRADUATION",
  "summary": "결제부터 장바구니까지 구현한 쇼핑몰",
  "description": "상세 설명 (마크다운 텍스트)",
  "myRole": "프론트엔드 리드",
  "thumbnailUrl": "/image/uuid_example.png",
  "githubLink": "https://github.com/hong/shop",
  "deploymentLink": "https://shop.example.com",
  "skills": ["React", "TypeScript", "GraphQL"],
  "participants": [
    { "userId": 2, "role": "Frontend" }
  ],
  "startDate": "2026-03-01",
  "endDate": "2026-05-01"
}
```

| 필드           | 타입   | 필수 | 설명                                                                                                       |
| -------------- | ------ | ---- | ---------------------------------------------------------------------------------------------------------- |
| projectName    | String | ✅   | 프로젝트명                                                                                                 |
| category       | String | ✅   | `GRADUATION` / `P_PROJECT` / `AUTONOMOUS`                                                                  |
| summary        | String | ✅   | 한 줄 요약 (최대 300자)                                                                                    |
| description    | String | ✅   | 상세 설명 (마크다운, `![설명](/image/uuid_파일명.png)` 문법으로 업로드 이미지 삽입)                         |
| myRole         | String | ✅   | 업로더 본인의 담당 역할                                                                                    |
| thumbnailUrl   | String | ❌   | 대표 이미지 URL (`POST /api/images/upload` 반환값 사용)                                                    |
| githubLink     | String | ❌   | GitHub 링크 (URL 형식, 중복 불가)                                                                          |
| deploymentLink | String | ❌   | 배포 링크 (URL 형식)                                                                                       |
| skills         | Array  | ✅   | 기술스택 목록 (1개 이상)                                                                                   |
| participants   | Array  | ❌   | 추가 참여자 `[{userId, role}]` — 업로더는 자동 등록. `GRADUATION`/`P_PROJECT`는 참여자 필수               |
| startDate      | String | ✅   | 시작일 (yyyy-MM-dd)                                                                                        |
| endDate        | String | ✅   | 종료일 (yyyy-MM-dd, ≥ startDate)                                                                           |

<!-- v2.0 원본: thumbnailUrl ✅ 필수, githubLink ✅ 필수 → 실제 엔티티는 둘 다 nullable -->

Response `201 Created`:

```json
{
  "success": true,
  "message": "포트폴리오 등록 완료",
  "data": { "id": 5, "projectName": "...", "canEdit": true, "owner": true, ... }
}
```

**예외 응답**:

| 상황                      | HTTP | 메시지                               |
| ------------------------- | ---- | ------------------------------------ |
| myRole 미입력             | 400  | "본인의 담당 역할을 입력해주세요."   |
| 기술스택 미입력           | 400  | "기술스택을 1개 이상 입력해주세요."  |
| endDate < startDate       | 400  | "종료일은 시작일 이후여야 합니다."   |
| GitHub 링크 중복          | 409  | "이미 등록된 GitHub 링크입니다."     |

---

### GET /api/portfolios/top

**메인 배너 — 기간별 TOP 1**

기간별 공감 수 1위 포트폴리오를 반환합니다. 해당 기간에 포트폴리오가 없으면 해당 period는 응답에서 제외됩니다.

<!-- v2.0 원본: "이번 학기 1위 / 지난 학기 1위 / 전체 기간 1위 각 1개씩, 총 3개" → 실제로는 데이터 있는 period만 반환 (최대 3개) -->

Response `200 OK`:

```json
{
  "success": true,
  "message": "메인 TOP 포트폴리오 조회 성공",
  "data": [
    {
      "period": "CURRENT_SEMESTER",
      "periodLabel": "이번 학기",
      "id": 1,
      "projectName": "DevLink API",
      "summary": "포트폴리오 공유",
      "authorName": "조하겸",
      "skills": ["Java", "Spring Boot", "JPA"],
      "likeCount": 0,
      "thumbnailUrl": null
    },
    {
      "period": "ALL_TIME",
      "periodLabel": "전체 기간",
      "id": 1,
      "projectName": "DevLink API",
      "summary": "포트폴리오 공유",
      "authorName": "조하겸",
      "skills": ["Java", "Spring Boot", "JPA"],
      "likeCount": 0,
      "thumbnailUrl": null
    }
  ]
}
```

> `period` 값: `CURRENT_SEMESTER`, `LAST_SEMESTER`, `ALL_TIME`

---

### GET /api/portfolios/popular

**메인 인기 포트폴리오 (누적 공감 TOP 3)**

Response `200 OK`:

```json
{
  "success": true,
  "message": "인기 포트폴리오 조회 성공",
  "data": [
    {
      "id": 1,
      "projectName": "DevLink API",
      "category": "AUTONOMOUS",
      "summary": "포트폴리오 공유",
      "thumbnailUrl": null,
      "likeCount": 0,
      "skills": ["Java", "Spring Boot", "JPA"],
      "authorName": "조하겸",
      "participantCount": 1,
      "githubLink": "https://github.com/hkjo0703/devlink",
      "deploymentLink": null,
      "startDate": "2026-03-01",
      "endDate": "2026-05-17",
      "createdAt": "2026-05-17T03:03:50.549232",
      "liked": false
    }
  ]
}
```

<!-- v2.0 원본: PortfolioListResponse 전체 필드 없이 일부만 나열. 실제는 전체 PortfolioListResponse 반환 -->

---

### GET /api/portfolios/ranking

**랭킹 목록 (기간 필터)**

Query Parameters:

| 파라미터 | 타입   | 설명                                                                                       |
| -------- | ------ | ------------------------------------------------------------------------------------------ |
| period   | String | `CURRENT_SEMESTER` / `LAST_SEMESTER` / `ALL_TIME` (기본값: `ALL_TIME`)                     |

Response `200 OK`:

```json
{
  "success": true,
  "message": "랭킹 조회 성공",
  "data": [
    {
      "id": 1,
      "projectName": "DevLink API",
      "category": "AUTONOMOUS",
      "summary": "포트폴리오 공유",
      "thumbnailUrl": null,
      "likeCount": 0,
      "skills": ["Java", "Spring Boot", "JPA"],
      "authorName": "조하겸",
      "participantCount": 1,
      "githubLink": "https://github.com/hkjo0703/devlink",
      "deploymentLink": null,
      "startDate": "2026-03-01",
      "endDate": "2026-05-17",
      "createdAt": "2026-05-17T03:03:50.549232",
      "liked": false
    }
  ]
}
```

<!-- v2.0 원본: `rank` 필드 포함한 응답 → 실제는 PortfolioListResponse 배열 (rank 없음)
```json
{
  "data": [{ "rank": 1, "id": 3, "projectName": "AI 챗봇", ... }]
}
```
-->

---

### GET /api/portfolios/{id}

**포트폴리오 상세 조회**

Response `200 OK`:

```json
{
  "success": true,
  "message": "상세 조회 성공",
  "data": {
    "id": 1,
    "projectName": "DevLink API",
    "category": "AUTONOMOUS",
    "summary": "포트폴리오 공유",
    "description": "Spring Boot REST API",
    "thumbnailUrl": null,
    "githubLink": "https://github.com/hkjo0703/devlink",
    "deploymentLink": null,
    "likeCount": 0,
    "skills": ["Java", "Spring Boot", "JPA"],
    "author": {
      "id": 1,
      "name": "조하겸",
      "studentId": "201932051"
    },
    "participants": [
      { "userId": 1, "name": "조하겸", "role": "Backend", "owner": true }
    ],
    "participantCount": 1,
    "startDate": "2026-03-01",
    "endDate": "2026-05-17",
    "createdAt": "2026-05-17T03:03:50.549232",
    "canEdit": true,
    "liked": false,
    "owner": true
  }
}
```

<!-- v2.0 원본 필드 차이:
- `participantList` → 실제는 `participants`
- participant 내 `isOwner` → 실제는 `owner`
- 최상위 `isLiked` → 실제는 `liked`
- 최상위 `isOwner` → 실제는 `owner`
-->

> `canEdit`: 현재 로그인 사용자가 수정 가능한 참여자인지 여부
> `owner`: 현재 로그인 사용자가 포트폴리오 소유자인지 여부
> 비로그인 시 `canEdit: false`, `owner: false`, `liked: false`

---

### PUT /api/portfolios/{id}

**포트폴리오 수정**

`can_edit = true`인 참여자만 가능. Request Body는 POST와 동일.

Response `200 OK`:

```json
{ "success": true, "message": "포트폴리오 수정 완료", "data": { ... } }
```

**예외 응답**:

| 상황               | HTTP | 메시지                  |
| ------------------ | ---- | ----------------------- |
| 수정 권한 없음     | 403  | "수정 권한이 없습니다." |

---

### DELETE /api/portfolios/{id}

**포트폴리오 삭제 (소프트 삭제)**

`is_owner = true`인 작성자만 삭제 가능. `is_deleted = true`로 처리합니다.

Response `200 OK`:

```json
{ "success": true, "message": "포트폴리오 삭제 완료", "data": null }
```

**예외 응답**:

| 상황               | HTTP | 메시지                  |
| ------------------ | ---- | ----------------------- |
| 삭제 권한 없음     | 403  | "삭제 권한이 없습니다." |

---

## 4. 공감 API (Like)

### POST /api/portfolios/{id}/likes

**공감 토글**

공감 추가/취소를 토글합니다. `likes` 테이블 UNIQUE(user_id, portfolio_id) 기준.

Response `200 OK`:

```json
{
  "success": true,
  "message": "공감을 추가했습니다.",
  "data": {
    "likeCount": 1,
    "liked": true
  }
}
```

<!-- v2.0 원본: message "공감이 추가되었습니다.", 필드 순서 `liked` → `likeCount` → 실제는 `likeCount` 먼저 -->

> 공감 취소 시 message: `"공감을 취소했습니다."`, `liked: false`

---

## 5. 기술스택 API (Skills)

### GET /api/skills

**기술스택 목록 조회 (자동완성용)**

Query Parameters:

| 파라미터 | 설명                                          |
| -------- | --------------------------------------------- |
| q        | 검색어 (선택, 예: `Ja` → Java 반환, 부분 일치) |
| category | 분류 필터 (선택, 예: `Frontend`)              |

Response `200 OK`:

```json
{
  "success": true,
  "message": "기술스택 목록 조회 성공",
  "data": [
    { "id": 1, "name": "Java", "category": "Other" },
    { "id": 2, "name": "Spring Boot", "category": "Other" }
  ]
}
```

<!-- v2.0 원본 응답 예시: category에 "Frontend" 등 분류값 → 현재 자유 입력으로 등록된 기술은 category "Other"로 저장됨 -->

---

## 6. 이미지 API (Image)

### POST /api/images/upload

**이미지 업로드 (로컬 서버 저장)**

포트폴리오 썸네일 또는 마크다운 본문에 삽입할 이미지를 서버에 저장하고 접근 가능한 URL을 반환합니다.

**Request** (`multipart/form-data`):

| Key  | Type | 필수 | 설명                                         |
| ---- | ---- | ---- | -------------------------------------------- |
| file | File | ✅   | 이미지 파일 (최대 5MB, jpg/jpeg/png/gif/webp) |

Response `200 OK`:

```json
{
  "success": true,
  "message": "이미지가 성공적으로 업로드되었습니다.",
  "data": {
    "imageUrl": "/image/f47ac10b-58cc-4372-a567-0e02b2c3d479_example.png"
  }
}
```

**예외 응답**:

| 상황                 | HTTP | 메시지                                          |
| -------------------- | ---- | ----------------------------------------------- |
| 비로그인             | 401  | "로그인이 필요한 서비스입니다."                 |
| 빈 파일              | 400  | "파일이 비어있습니다."                          |
| 허용되지 않은 형식   | 400  | "jpg, png, gif, webp 형식의 이미지만 업로드 가능합니다." |
| 5MB 초과             | 400  | Spring 기본 multipart 초과 오류                 |

### GET /image/{filename}

**업로드된 이미지 서빙**

`POST /api/images/upload`로 업로드된 이미지를 제공합니다. 인증 불필요.

```
GET /image/f47ac10b-58cc-4372-a567-0e02b2c3d479_example.png
→ 200 OK (이미지 바이너리)
```

---

## 7. 공통 응답 형식

### 성공

```json
{ "success": true, "message": "성공 메시지", "data": { ... } }
```

### 실패

```json
{ "success": false, "message": "에러 메시지", "data": null }
```

### HTTP 상태 코드

| 코드 | 의미                                              |
| ---- | ------------------------------------------------- |
| 200  | 성공                                              |
| 201  | 생성 성공 (register, 포트폴리오 작성)             |
| 400  | 잘못된 요청 (유효성 검증 실패)                    |
| 401  | 인증 필요 (미로그인 / 포털 인증 실패 / 세션 없음) |
| 403  | 권한 없음 (수정/삭제 권한 미보유)                 |
| 404  | 리소스 없음                                       |
| 409  | 중복 (portalId, studentId, GitHub 링크)           |
| 500  | 서버 내부 오류                                    |

### 인증 방식

| 항목      | 내용                                                 |
| --------- | ---------------------------------------------------- |
| 인증 토큰 | ❌ JWT 없음                                          |
| 세션 관리 | Spring Security `HttpSession`                        |
| 세션 ID   | 서버가 `Set-Cookie: JSESSIONID=...` 헤더로 전달      |
| 이후 요청 | 브라우저가 `Cookie: JSESSIONID=...` 자동 포함        |
| 세션 만료 | `server.servlet.session.timeout=3600s`               |
| 로그아웃  | 서버 세션 무효화 + `JSESSIONID` 쿠키 만료            |

---

## 8. DB 테이블 ↔ API 매핑 요약

| DB 테이블                | 관련 API                                                    |
| ------------------------ | ----------------------------------------------------------- |
| `users`                  | Auth(1~3), User(4~7)                                        |
| `portfolios`             | Portfolio(8~15)                                             |
| `skills`                 | Skills(17), Portfolio 작성/수정 시 자동 처리                |
| `portfolio_skills`       | Portfolio 작성/수정/조회 시 내부 처리                       |
| `portfolio_participants` | Portfolio 작성(자동 생성), 수정 권한 판별, 참여자 목록 조회 |
| `likes`                  | Like(16), 공감 수 집계 → portfolios.like_count              |
| `static/image/`          | Image(18~19) — 파일 시스템 저장, `/image/**` URL 서빙      |

---

_v2.1 — 2026.05.17 전체 API 실행 테스트 결과 반영 (포털 SSO 연동 완료, 이미지 업로드 API 추가)_