# 서버 API 연동 점검

## 1. 서버 정보

- API 서버: `http://34.158.219.4:8080`
- Swagger UI: `http://34.158.219.4:8080/swagger-ui/index.html`
- 실제 OpenAPI 문서: `http://34.158.219.4:8080/api-docs`

## 2. 적용한 변경

- `.env`
  - `VITE_API_BASE_URL=`로 비워 로컬 개발 서버에서는 상대 경로 `/api`를 사용하도록 설정했습니다.
  - `VITE_API_PROXY_TARGET=http://34.158.219.4:8080`를 추가했습니다.
- `vite.config.ts`
  - `/api`와 `/image` 요청을 `http://34.158.219.4:8080`로 프록시하도록 설정했습니다.
  - 서버가 CORS 헤더를 내려주지 않고 `OPTIONS` 요청에 401을 반환하므로, 로컬 테스트는 Vite 프록시를 통해 진행하도록 구성했습니다.
- `src/services/api.ts`
  - 서버 Swagger에 없는 미사용 `POST /api/auth/logout` 서비스 함수를 제거했습니다.

## 3. Swagger 기준 API 일치 여부

서버 Swagger에서 확인한 API 목록과 프론트에서 사용하는 API 목록은 일치합니다.

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/users/me/portfolios`
- `GET /api/users/search`
- `GET /api/portfolios`
- `POST /api/portfolios`
- `GET /api/portfolios/top`
- `GET /api/portfolios/popular`
- `GET /api/portfolios/ranking`
- `GET /api/portfolios/{id}`
- `PUT /api/portfolios/{id}`
- `DELETE /api/portfolios/{id}`
- `POST /api/portfolios/{id}/likes`
- `POST /api/images/upload`

참고로 서버 Swagger에는 `GET /api/skills`도 존재하지만, 현재 프론트 화면에서는 아직 자동완성 UI가 없어 호출하지 않습니다.

## 4. 실제 서버 응답 확인

다음 공개 API는 서버에서 `200 OK` 응답을 확인했습니다.

- `GET /api/portfolios/popular`
- `GET /api/portfolios?page=0&size=5&sort=LATEST`
- `GET /api/portfolios/top`
- `GET /api/portfolios/ranking?period=CURRENT_SEMESTER`

인증 필요 API인 `GET /api/users/me`는 비로그인 상태에서 `401 Unauthorized`를 반환하는 것을 확인했습니다.

## 5. CORS 확인 결과

- `Origin: http://127.0.0.1:5175`를 포함한 직접 API 응답에서 `Access-Control-Allow-Origin` 헤더가 확인되지 않았습니다.
- `OPTIONS /api/portfolios/popular` 요청은 `401 Unauthorized`를 반환했습니다.
- 따라서 브라우저에서 API 서버를 직접 호출하면 CORS 오류가 날 수 있어, 로컬 개발 테스트는 Vite 프록시를 사용해야 합니다.

## 6. 테스트 방법

1. 개발 서버를 실행합니다.

```bash
npm run dev
```

2. 브라우저에서 프론트를 엽니다.

```text
http://127.0.0.1:5175/
```

3. 프록시 API가 동작하는지 확인합니다.

```text
http://127.0.0.1:5175/api/portfolios/popular
```

## 7. 검증 결과

- `npm run build` 통과
- `npm run lint` 통과
- `http://127.0.0.1:5175/api/portfolios/popular` 서버 데이터 응답 확인

## 참조 문서

- `Reference/사용자 요구사항 정의.md`
- `Reference/API 명세서.md`
- `Reference/DB 테이블 명세서.md`
