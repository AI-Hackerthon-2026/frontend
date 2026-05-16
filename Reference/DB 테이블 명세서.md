# 데이터베이스 테이블 명세서 (Database Schema)

> **프로젝트**: DevLink - 포트폴리오 공유 및 랭킹 플랫폼
> **작성일**: 2026년 5월 16일 / **수정일**: 2026년 5월 17일 (v1.1 — 실제 엔티티 기준 반영)
> **버전**: 1.1
> **참조 문서**: `사용자 요구사항 정의.md`, Portfolio.java 엔티티 코드

## 목차

- **개요**: 문서 정보 및 데이터베이스 개요
- **1. 사용자 (users)**: 사용자 테이블 컬럼 및 제약조건
- **2. 포트폴리오 (portfolios)**: 포트폴리오 테이블 개요 및 컬럼 정의
- **3. 기술 스택 (skills)**: 기술스택 테이블 및 분류
- **4. 포트폴리오-기술 매핑 (portfolio_skills)**: 다대다 매핑 설명
- **5. 참여자 (portfolio_participants)**: 포트폴리오 참여자 및 권한 관리
- **6. 공감 (likes)**: 공감(좋아요) 기능 및 제약조건
- **관계도(ERD)**: 엔터티 관계도 및 설명
- **추가 사항**: 성능 최적화 및 향후 확장 계획

---

## 1. 사용자

**설명**: 회원가입, 로그인, 프로필 관리 기능을 담당

### 컬럼 정의

| #   | 컬럼명      | 데이터 타입  | 제약조건                             | 설명                                                             |
| --- | ----------- | ------------ | ------------------------------------ | ---------------------------------------------------------------- |
| 1   | id          | BIGINT       | PK, AUTO_INCREMENT                   | 사용자 ID (기본키)                                               |
| 2   | name        | VARCHAR(50)  | NOT NULL                             | 사용자 이름 (필수)                                               |
| 3   | portal_id   | VARCHAR(50)  | NOT NULL, UNIQUE                     | 학교 포털 ID (필수, 중복 불가)                                   |
| 4   | grade       | INT          | NOT NULL                             | 학년 (1~4학년, 필수)                                             |
| 5   | student_id  | VARCHAR(9)   | NOT NULL, UNIQUE                     | 학번 (9자리 숫자, 필수, 중복 불가, 애플리케이션 레벨 9자리 검증) |
| 7   | github_link | VARCHAR(300) | NULL                                 | GitHub 프로필 링크 (URL, 선택)                                   |
| 8   | user_level  | VARCHAR(20)  | NOT NULL, DEFAULT 'STUDENT'          | 사용자 유형 (STUDENT, PROFESSOR, ADMIN)                          |
| 9   | created_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP            | 계정 생성 일시                                                   |
| 10  | updated_at  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, ON UPDATE | 계정 최종 수정 일시                                              |

### 제약조건

- **portal_id 수정**: 회원가입 후 수정 불가 (포털 로그인 아이디, 고정 식별자)
- **user_level 수정**: 회원가입 후 수정 불가 (추후 관리자만 변경 가능하도록 확대 가능)
- **비밀번호 저장 없음**: 현재 시스템은 포털 인증 기반으로 동작하며, 사용자 테이블에 비밀번호 컬럼을 저장하지 않습니다.
- **user_level 수정**: 회원가입 후 수정 불가 (추후 관리자만 변경 가능하도록 확대 가능)

### 사용자 유형 (user_level)

| 유형   | 값        | 설명           | 권한                              |
| ------ | --------- | -------------- | --------------------------------- |
| 학생   | STUDENT   | 일반 학생      | 포트폴리오 작성, 조회, 공감       |
| 교수   | PROFESSOR | 지도 교수/강사 | 포트폴리오 조회, 평가 (추후 개발) |
| 관리자 | ADMIN     | 시스템 관리자  | 전체 관리 기능 (추후 개발)        |

---

## 2. 포트폴리오 (portfolios)

### 테이블 개요

사용자가 작성한 포트폴리오(프로젝트) 정보를 관리하는 테이블입니다.

**테이블명**: `portfolios`

**설명**: 포트폴리오 작성, 조회, 수정, 삭제 기능을 담당

### 컬럼 정의

| #   | 컬럼명          | 데이터 타입  | 제약조건                                                             | 설명                                                                                   |
| --- | --------------- | ------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1   | id              | BIGINT       | PK, AUTO_INCREMENT                                                   | 포트폴리오 ID (기본키)                                                                 |
| 2   | user_id         | BIGINT       | NOT NULL, FK([users.id](http://users.id/))                           | 작성자 ID (필수)                                                                       |
| 3   | project_name    | VARCHAR(100) | NOT NULL                                                             | 프로젝트명 (필수)                                                                      |
| 4   | category        | VARCHAR(20)  | NOT NULL, CHECK(category IN ('GRADUATION','P_PROJECT','AUTONOMOUS')) | 프로젝트 카테고리 (졸업 프로젝트, P-프로젝트, 자율 프로젝트)                           |
| 5   | summary         | VARCHAR(300) | NOT NULL                                                             | 프로젝트 한 줄 요약 (필수, 최대 300자)                                                 |
| 6   | description     | LONGTEXT     | NOT NULL                                                             | 프로젝트 상세 설명 (필수, 마크다운 텍스트 — `![설명](/image/uuid_파일명.png)` 문법으로 업로드 이미지 삽입) |
<!-- v1.0 원본
| 7   | thumbnail_url   | VARCHAR(500) | NOT NULL                                                             | 대표 이미지 URL (필수, 5MB 이하)                                                       |
| 8   | github_link     | VARCHAR(300) | NOT NULL, UNIQUE                                                     | GitHub 저장소 링크 (필수, URL 형식, 중복 불가)                                         |
-->
| 7   | thumbnail_url   | VARCHAR(500) | NULL                                                                 | 대표 이미지 URL (선택, `POST /api/images/upload` 반환값 사용)                          |
| 8   | github_link     | VARCHAR(300) | NULL, UNIQUE                                                         | GitHub 저장소 링크 (선택, URL 형식, 입력 시 중복 불가)                                 |
| 9   | deployment_link | VARCHAR(300) | NULL                                                                 | 배포 링크 (선택, URL 형식)                                                             |
| 10  | start_date      | DATE         | NOT NULL                                                             | 프로젝트 시작 날짜 (필수)                                                              |
| 11  | end_date        | DATE         | NOT NULL                                                             | 프로젝트 종료 날짜 (필수)                                                              |
| 12  | like_count      | INT          | DEFAULT 0                                                            | 공감 수 (캐시 필드, 조회 성능 향상)                                                    |
| 13  | is_deleted      | BOOLEAN      | DEFAULT FALSE                                                        | 소프트 삭제 여부 (기본값: false)                                                       |
| 14  | created_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                            | 포트폴리오 생성 일시                                                                   |
| 15  | updated_at      | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP, ON UPDATE                                 | 포트폴리오 최종 수정 일시                                                              |

### 제약조건

- **기간 검증**: end_date >= start_date (애플리케이션 레벨 검증)
<!-- v1.0 원본: thumbnail_url 필수, 5MB 이하 → 실제 엔티티 nullable
- **대표 이미지 크기**: thumbnail_url 대상, 5MB 이하 (애플리케이션 레벨 검증)
-->
- **대표 이미지**: `thumbnail_url` nullable — 업로드 시 `POST /api/images/upload`로 서버 로컬 저장 후 반환된 `/image/uuid_파일명` 경로를 저장. 5MB 제한은 업로드 API에서 처리
<!-- v1.0 원본: 외부 URL 링크 → v1.1: 서버 로컬 업로드 지원
- **마크다운 내 이미지 삽입**: description(LONGTEXT) 내 `![설명](https://...)` 마크다운 문법으로 외부 URL 이미지 삽입 — 별도 image_url 컬럼 불필요
-->
- **마크다운 내 이미지 삽입**: description(LONGTEXT) 내 `![설명](/image/uuid_파일명.png)` 마크다운 문법으로 서버 로컬 이미지 삽입 — 별도 image_url 컬럼 불필요
- **URL 형식**: GitHub, 배포 링크는 유효한 URL 형식 (애플리케이션 레벨 검증)
- **GitHub 링크 중복 방지**: `github_link`는 UNIQUE 제약 (NULL 허용, 입력 시 중복 불가)
- **소프트 삭제**: is_deleted = true일 때 목록 조회에서 제외
- **랭킹 산정 기간**: 핵심 정보(project_name, skills) 수정 제약 (추후 정책 적용)

---

## 3. 기술 스택 (skills)

### 테이블 개요

포트폴리오에서 사용할 수 있는 기술스택(프로그래밍 언어, 프레임워크, 라이브러리 등)을 관리하는 테이블입니다.
사용자가 포트폴리오 작성 시 자유롭게 기술스택을 입력하면 자동으로 skills 테이블에 추가됩니다.

**테이블명**: `skills`

**설명**: 기술스택 목록 관리, 사용자가 자유롭게 입력 가능하고 동적으로 확장

### 컬럼 정의

| #   | 컬럼명     | 데이터 타입 | 제약조건                  | 설명                                                          |
| --- | ---------- | ----------- | ------------------------- | ------------------------------------------------------------- |
| 1   | id         | BIGINT      | PK, AUTO_INCREMENT        | 기술 ID (기본키)                                              |
| 2   | name       | VARCHAR(50) | NOT NULL, UNIQUE          | 기술명 (예: Java, React, PostgreSQL)                          |
| 3   | category   | VARCHAR(30) | NULL                      | 기술 분류 (예: Language, Frontend, Backend, Database, DevOps) |
| 4   | created_at | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP | 생성 일시                                                     |

### 제약조건

- **기술명 중복**: UNIQUE 제약으로 방지
- **자유로운 입력**: 사용자가 포트폴리오 작성 시 새로운 기술을 자유롭게 입력 가능
- **자동 등록**: 입력된 기술이 skills 테이블에 없으면 자동으로 추가됨
- **중복 방지**: 같은 이름의 기술은 자동으로 병합됨 (UNIQUE 제약으로 보장)

### 기술 분류

| 분류     | 예시                                             |
| -------- | ------------------------------------------------ |
| Language | Java, Python, JavaScript, TypeScript, C++, Go    |
| Frontend | React, Vue, Angular, HTML, CSS                   |
| Backend  | Spring Boot, Node.js, Django, FastAPI, Express   |
| Database | MySQL, PostgreSQL, MongoDB, Redis                |
| DevOps   | Docker, Kubernetes, AWS, GitHub Actions, Jenkins |
| Mobile   | Flutter, React Native, Swift, Kotlin             |
| Other    | Git, Figma, etc.                                 |

---

## 4. 포트폴리오-기술 매핑 (portfolio_skills)

### 테이블 개요

포트폴리오와 기술스택 간의 다대다(Many-to-Many) 관계를 관리하는 중간 테이블입니다.

**테이블명**: `portfolio_skills`

**설명**:

- 한 포트폴리오는 여러 기술을 사용할 수 있고, 한 기술은 여러 포트폴리오에서 사용될 수 있습니다.
- 사용자가 입력한 기술은 자동으로 skills 테이블에 추가되고 portfolio_skills로 연결됩니다.

**사용 시나리오**:

1. 사용자가 포트폴리오 작성 시 기술스택 입력: "React, Node.js, GraphQL"
2. 시스템이 각 기술을 skills 테이블에 검색
3. 없는 기술이 있으면 → skills에 자동 등록
4. portfolio_skills 테이블에 모든 기술 연결

### 컬럼 정의

| #   | 컬럼명       | 데이터 타입 | 제약조건                                             | 설명                 |
| --- | ------------ | ----------- | ---------------------------------------------------- | -------------------- |
| 1   | id           | BIGINT      | PK, AUTO_INCREMENT                                   | 매핑 ID (기본키)     |
| 2   | portfolio_id | BIGINT      | NOT NULL, FK([portfolios.id](http://portfolios.id/)) | 포트폴리오 ID (필수) |
| 3   | skill_id     | BIGINT      | NOT NULL, FK([skills.id](http://skills.id/))         | 기술 ID (필수)       |
| 4   | created_at   | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP                            | 생성 일시            |

### 제약조건

- **복합 유니크**: (portfolio_id, skill_id) - 한 포트폴리오에서 같은 기술을 중복으로 등록할 수 없음
  **외래키 삭제**: 포트폴리오 삭제 시 자동으로 해당 매핑 제거

---

## 5. 참여자 (portfolio_participants)

### 테이블 개요

포트폴리오에 함께 참여하는 사용자를 관리하는 테이블입니다. 참여자 레코드가 존재하면 해당 사용자는 그 포트폴리오에 대해 수정 권한을 가집니다. 업로더(`portfolios.user_id`)는 기본적으로 소유자로 간주되어 참여자 레코드가 자동 생성되어야 합니다.

**테이블명**: `portfolio_participants`

**설명**: 포트폴리오와 사용자 간의 참여 관계(권한 포함)를 관리

### 컬럼 정의

| #   | 컬럼명       | 데이터 타입  | 제약조건                                             | 설명                                               |
| --- | ------------ | ------------ | ---------------------------------------------------- | -------------------------------------------------- |
| 1   | id           | BIGINT       | PK, AUTO_INCREMENT                                   | 참여자 레코드 ID (기본키)                          |
| 2   | portfolio_id | BIGINT       | NOT NULL, FK([portfolios.id](http://portfolios.id/)) | 대상 포트폴리오 ID                                 |
| 3   | user_id      | BIGINT       | NOT NULL, FK([users.id](http://users.id/))           | 참여자(사용자) ID                                  |
| 4   | role         | VARCHAR(100) | NOT NULL                                             | 포트폴리오에서의 역할 (예: Backend, PM, 필수 입력) |
| 5   | can_edit     | BOOLEAN      | DEFAULT TRUE                                         | 수정 권한 여부 (true면 해당 포트폴리오 수정 가능)  |
| 6   | is_owner     | BOOLEAN      | DEFAULT FALSE                                        | 업로더/소유자 표시 (업로더는 true로 설정)          |
| 7   | joined_at    | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                            | 참여 등록 일시                                     |

### 인덱스 및 제약조건

| 인덱스/제약조건   | 컬럼                  | 설명                   |
| ----------------- | --------------------- | ---------------------- |
| uk_portfolio_user | portfolio_id, user_id | UNIQUE: 중복 참여 방지 |
| fk_portfolio      | portfolio_id          | FK 참조 무결성         |
| fk_user           | user_id               | FK 참조 무결성         |

### 권한 정책

- 참여자 레코드가 존재하고 `can_edit = TRUE`인 경우 해당 사용자는 포트폴리오 수정 권한을 가집니다.
- 포트폴리오 업로더(`portfolios.user_id`)는 자동으로 `portfolio_participants`에 `is_owner = TRUE, can_edit = TRUE`로 등록되어야 합니다.
- 참여자 삭제 또는 `can_edit` 변경은 소유자(또는 관리자)만 수행할 수 있습니다 (애플리케이션 레벨 권한 검증).

### 예시 SQL

```sql
-- 업로더 자동 등록 (예시)
INSERT INTO portfolio_participants (portfolio_id, user_id, role, can_edit, is_owner)
VALUES (1, 1, 'Backend Developer', TRUE, TRUE);

-- 협업자 추가
INSERT INTO portfolio_participants (portfolio_id, user_id, role)
VALUES (1, 2, 'Frontend Developer');

-- 협업자 삭제(권한 관리 예시)
DELETE FROM portfolio_participants WHERE portfolio_id = 1 AND user_id = 2;
```

---

## 6. 공감 (likes)

### 테이블 개요

사용자가 포트폴리오에 남기는 공감(좋아요)을 관리하는 테이블입니다。

**테이블명**: `likes`

**설명**: 공감 기능, 사용자별 공감 이력 추적

### 컬럼 정의

| #   | 컬럼명       | 데이터 타입 | 제약조건                                             | 설명                           |
| --- | ------------ | ----------- | ---------------------------------------------------- | ------------------------------ |
| 1   | id           | BIGINT      | PK, AUTO_INCREMENT                                   | 공감 ID (기본키)               |
| 2   | user_id      | BIGINT      | NOT NULL, FK([users.id](http://users.id/))           | 공감한 사용자 ID (필수)        |
| 3   | portfolio_id | BIGINT      | NOT NULL, FK([portfolios.id](http://portfolios.id/)) | 공감 대상 포트폴리오 ID (필수) |
| 4   | created_at   | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP                            | 공감 일시                      |

### 제약조건

- **중복 방지**: (user_id, portfolio_id) UNIQUE - 한 사용자는 한 포트폴리오에 한 번만 공감 가능
- **공감 취소**: 기존 공감 레코드 삭제 시 like_count -1
- **자동 집계**: 포트폴리오의 like_count를 실시간으로 업데이트

### 공감 정책

| 정책                        | 설명                         | 상태              |
| --------------------------- | ---------------------------- | ----------------- |
| 비로그인 상태에서 공감 불가 | 로그인 필수                  | MVP 기능          |
| 본인 포트폴리오 공감        | 가능하나 별도 안내 표시      | 정책 확정 후 반영 |
| 공감 취소                   | 공감 상태에서 재클릭 시 취소 | MVP 기능          |

---

## 관계도

### Entity Relationship Diagram (ERD)

```
┌─────────────┐
│   users     │
├─────────────┤
│ id (PK)     │
│ name        │
│ portal_id   │
│ student_id  │◄──────┐
│ grade       │       │
│ github_link │       │ 1:N
│ user_level  │       │
│ created_at  │       │
└─────────────┘       │
       ▲              │
       │              │
       │ 1:N          │
       │              │
       │         ┌─────────────────┐
       │         │  portfolios     │
       │         ├─────────────────┤
       │         │ id (PK)         │
       │         │ user_id (FK) ───┼──────┐
       │         │ category        │      │
       │         │ project_name    │      │
       │         │ summary         │      │
       │         │ description     │      │
       │         │ thumbnail_url   │      │
       │         │ github_link     │      │
<!-- v1.0: image_url 컬럼 있었으나 실제 엔티티에 존재하지 않음 → 삭제 -->
       │         │ deployment_link │      │
       │         │ start_date      │      │
       │         │ end_date        │      │
       │         │ like_count      │      │
       │         │ is_deleted      │      │
       │         │ created_at      │      │
       │         └─────────────────┘      │
       │              ▲                   │
       │              │ N:M               │
       │              │                   │
       │         ┌──────────────────────┐ │
       │         │ portfolio_skills     │ │
       │         ├──────────────────────┤ │
       │         │ id (PK)              │ │
       │         │ portfolio_id (FK) ───┼─┘
       │         │ skill_id (FK) ──────┐│
       │         │ created_at          ││
       │         └──────────────────────┘│
       │                                 │
       │                            ┌────┴──────────┐
       │                            │                │
       │                       1:N  │
       │                            │
       │                     ┌──────────┐
       │                     │  skills  │
       │                     ├──────────┤
       │                     │ id (PK)  │
       │                     │ name     │
       │                     │ category │
       │                     │ created_ │
       │                     └──────────┘
       │
       │ 1:N
         │
         │  ┌────────────────────┐
         └─►│ portfolio_participants │
             ├────────────────────┤
             │ id (PK)            │
             │ portfolio_id (FK)  │
             │ user_id (FK)       │
             │ role               │
             │ can_edit           │
             │ is_owner           │
             │ joined_at          │
             └────────────────────┘
         │
         │  ┌──────────────┐
         └─►│    likes     │
             ├──────────────┤
             │ id (PK)      │
             │ user_id (FK) │
             │ portfolio_id │
             │ created_at   │
             └──────────────┘
```

### 관계 설명

1. **users ↔ portfolios** (1:N)
   - 한 사용자는 여러 포트폴리오를 작성할 수 있습니다.
   - 포트폴리오는 하나의 작성자만 가질 수 있습니다.
   - FK: portfolios.user_id → [users.id](http://users.id/)
2. **portfolios ↔ skills** (N:M)
   - 한 포트폴리오는 여러 기술을 사용할 수 있습니다.
   - 한 기술은 여러 포트폴리오에서 사용될 수 있습니다.
   - 중간 테이블: portfolio_skills
3. **users ↔ likes** (1:N)
   - 한 사용자는 여러 포트폴리오에 공감할 수 있습니다.
   - FK: likes.user_id → [users.id](http://users.id/)
4. **portfolios ↔ likes** (1:N)
   - 한 포트폴리오는 여러 사용자로부터 공감을 받을 수 있습니다.
   - FK: likes.portfolio_id → [portfolios.id](http://portfolios.id/)
5. **portfolios ↔ participants** (1:N) & **users ↔ participants** (1:N)
   - 한 포트폴리오는 여러 참여자를 가질 수 있으며, 참여자는 포트폴리오에 대해 수정 권한을 가질 수 있습니다.
   - `portfolio_participants` 테이블이 중간 테이블로 매핑을 관리합니다.
   - FK: portfolio_participants.portfolio_id → [portfolios.id](http://portfolios.id/), portfolio_participants.user_id → [users.id](http://users.id/)

---

## 추가 사항

### 기술스택 입력 방식 (Skills Management)

**사용자 자유로운 입력**

- 포트폴리오 작성 시 사용자가 원하는 기술스택을 자유롭게 입력 가능
- 입력된 기술이 skills 테이블에 없으면 자동으로 추가됨
- UNIQUE 제약으로 중복 입력 자동 방지

**사용 흐름도**

```
포트폴리오 작성 페이지 (사용자)
          ↓
    기술스택 입력 (태그 방식)
     "React, Node.js, GraphQL"
          ↓
  Backend 검증 로직
          ↓
  각 기술별로 처리:
  ├─ React → skills에 존재 → portfolio_skills 연결
  ├─ Node.js → skills에 존재 → portfolio_skills 연결
  └─ GraphQL → skills에 미존재 → skills에 신규 등록 → portfolio_skills 연결
```

**데이터베이스 처리**

```sql
-- 1단계: 입력된 기술 확인 및 신규 기술 등록
INSERT INTO skills (name, category)
SELECT 'GraphQL', 'Backend'
WHERE NOT EXISTS (SELECT 1 FROM skills WHERE name = 'GraphQL');

-- 2단계: 포트폴리오-기술 연결
INSERT INTO portfolio_skills (portfolio_id, skill_id)
SELECT 1, id FROM skills WHERE name IN ('React', 'Node.js', 'GraphQL');
```

### 기술스택 필터링

**포트폴리오 목록 조회 시**

- skills 테이블의 모든 기술을 필터링 대상으로 제공
- 자동완성(Autocomplete) 기능에 기존 기술 제시
- 사용자가 새로운 기술 입력 가능

**중복 방지**

| 상황                             | 처리 방법                                         |
| -------------------------------- | ------------------------------------------------- |
| 같은 포트폴리오에 같은 기술 입력 | `uk_portfolio_skill` UNIQUE 제약으로 방지         |
| 다른 사용자가 같은 기술 입력     | skills 테이블의 `UNIQUE(name)` 제약으로 자동 병합 |

### 예시 데이터

```sql
-- 사용자가 자유롭게 입력한 기술들
INSERT INTO skills (name, category) VALUES
  ('Java', 'Language'),
  ('Spring Boot', 'Backend'),
  ('React', 'Frontend'),
  ('Node.js', 'Backend'),
  ('PostgreSQL', 'Database'),
  ('GraphQL', 'Backend'),
  ('Docker', 'DevOps'),
  ('Kubernetes', 'DevOps');

-- 포트폴리오-기술 연결
INSERT INTO portfolio_skills (portfolio_id, skill_id) VALUES
  (1, 1), -- Java
  (1, 2), -- Spring Boot
  (1, 7), -- Docker
  (1, 8), -- Kubernetes
  (2, 3), -- React
  (2, 4), -- Node.js
  (2, 6); -- GraphQL
```

### 데이터 타입 선택 근거

| 타입      | 사용 사유                      | 예시                                |
| --------- | ------------------------------ | ----------------------------------- |
| VARCHAR   | 길이 제한이 있는 문자열        | 이름(50자), 학번(20자), 링크(300자) |
| LONGTEXT  | 길이 제한이 없는 대용량 텍스트 | 포트폴리오 상세 설명                |
| BIGINT    | 대용량 데이터 대비             | ID (PK, FK)                         |
| INT       | 정수형 데이터                  | 학년, 참여 인원, 공감 수            |
| DATE      | 날짜만 필요                    | 프로젝트 시작/종료 날짜             |
| TIMESTAMP | 날짜 및 시간 필요              | 생성/수정 일시                      |
| BOOLEAN   | 참/거짓 값                     | 활성 여부, 삭제 여부                |

### 성능 최적화 전략

1. **캐시 필드 (like_count)**
   - 포트폴리오의 공감 수를 portfolios 테이블에 캐시하여 조회 성능 향상
   - likes 테이블 전체 스캔 대신 portfolios.like_count 직접 사용
2. **소프트 삭제 (is_deleted)**
   - 포트폴리오 삭제 시 물리 삭제 대신 is_deleted = true로 처리
   - 데이터 복구 가능, 랭킹 히스토리 보존
3. **복합 인덱스**
   - (user_id, created_at): 사용자별 최신 포트폴리오 조회 최적화
   - (portfolio_id, skill_id): 중복 공감 방지 및 조회 최적화
4. **외래키 제약**
   - 데이터 무결성 보장
   - ON DELETE CASCADE: 사용자 삭제 시 관련 포트폴리오 및 공감 자동 삭제 (또는 소프트 삭제로 변경)

### 향후 확장 계획

1. **프로필 이미지 저장**
   - users 테이블에 profile_image_url 컬럼 추가
2. **팀 포트폴리오 지원**
   - team 테이블 추가
   - portfolio.user_id → team_id로 변경
   - team_members 다대다 테이블 추가
3. **댓글 및 평가 시스템**
   - comments 테이블: 포트폴리오 댓글
   - reviews 테이블: 교수/관리자 평가 (추후 개발)
4. **알림 시스템**
   - notifications 테이블: 공감, 댓글 등 알림 기록
5. **검색 및 필터**
   - full-text index: 프로젝트명, 요약 검색 최적화

---

**문서 작성자**: DevLink Team

**최종 수정일**: 2026년 5월 16일

**버전**: 1.0
