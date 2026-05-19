# Task List
## 웹 기반 전화번호 관리 시스템 (SAD Phonebook)

> 상태: `[ ]` 미완료 / `[x]` 완료

---

## Phase 1. 프로젝트 초기 설정

- [ ] **1-1** Vercel 계정 생성 및 CLI 설치 (`npm i -g vercel`)
- [ ] **1-2** Supabase 계정 생성 및 새 프로젝트 생성
- [ ] **1-3** Next.js 프로젝트 생성 (`npx create-next-app@latest sad-phonebook`)
  - App Router 사용
  - TypeScript 사용
- [ ] **1-4** 필요한 패키지 설치
  - `@supabase/supabase-js`
- [ ] **1-5** 환경 변수 파일 설정 (`.env.local`)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] **1-6** `.gitignore`에 `.env.local` 추가 확인

---

## Phase 2. Supabase 데이터베이스 설정

- [ ] **2-1** Supabase SQL Editor에서 `contacts` 테이블 생성
  ```sql
  CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(200),
    memo TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );
  ```
- [ ] **2-2** `updated_at` 자동 갱신 트리거 생성
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  ```
- [ ] **2-3** RLS(Row Level Security) 활성화 및 공개 정책 설정
  ```sql
  ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow all" ON contacts
    FOR ALL USING (true) WITH CHECK (true);
  ```
- [ ] **2-4** Supabase에서 연결 정보(URL, anon key) 복사 후 `.env.local`에 입력

---

## Phase 3. Supabase 클라이언트 설정

- [ ] **3-1** `lib/supabase.ts` 파일 생성 — Supabase 클라이언트 초기화
- [ ] **3-2** `types/contact.ts` 파일 생성 — `Contact` 타입 정의
  ```typescript
  export type Contact = {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    memo: string | null;
    created_at: string;
    updated_at: string;
  };
  ```

---

## Phase 4. API 엔드포인트 구현

- [ ] **4-1** `GET /api/contacts` — 전체 연락처 목록 조회 (이름 오름차순)
- [ ] **4-2** `POST /api/contacts` — 새 연락처 등록
  - 이름, 전화번호 필수값 검증
  - 전화번호 형식 유효성 검사 (숫자, 하이픈만 허용)
  - 중복 전화번호 에러 처리
- [ ] **4-3** `PUT /api/contacts/[id]` — 연락처 수정
  - 동일한 유효성 검사 적용
- [ ] **4-4** `DELETE /api/contacts/[id]` — 연락처 삭제
- [ ] **4-5** 검색 기능 지원 — `GET /api/contacts?q=검색어` 쿼리 파라미터 처리

---

## Phase 5. 프론트엔드 UI 구현

### 5-1. 공통 컴포넌트
- [ ] **5-1-1** `ContactForm` 컴포넌트 — 이름, 전화번호, 이메일, 메모 입력 폼 (추가/수정 공용)
- [ ] **5-1-2** `Modal` 컴포넌트 — 추가/수정/삭제 확인 다이얼로그 공용 래퍼
- [ ] **5-1-3** `SearchBar` 컴포넌트 — 검색 입력창

### 5-2. 메인 페이지 (`/`)
- [ ] **5-2-1** 연락처 목록 테이블 렌더링 (이름, 전화번호, 이메일, 메모, 수정/삭제 버튼)
- [ ] **5-2-2** 검색창 — 입력값으로 실시간 필터링 또는 API 호출
- [ ] **5-2-3** "새 연락처 추가" 버튼 → 추가 모달 오픈
- [ ] **5-2-4** 연락처가 없을 때 빈 상태 메시지 표시

### 5-3. 연락처 추가 모달
- [ ] **5-3-1** `ContactForm` 컴포넌트 렌더링 (빈 폼)
- [ ] **5-3-2** 저장 버튼 클릭 시 `POST /api/contacts` 호출
- [ ] **5-3-3** 성공 시 목록 갱신 및 모달 닫기
- [ ] **5-3-4** 에러 시 폼 하단에 에러 메시지 표시

### 5-4. 연락처 수정 모달
- [ ] **5-4-1** `ContactForm` 컴포넌트 렌더링 (기존 데이터 채움)
- [ ] **5-4-2** 저장 버튼 클릭 시 `PUT /api/contacts/:id` 호출
- [ ] **5-4-3** 성공 시 목록 갱신 및 모달 닫기

### 5-5. 삭제 확인 다이얼로그
- [ ] **5-5-1** "정말 삭제하시겠습니까?" 메시지 표시
- [ ] **5-5-2** 확인 버튼 클릭 시 `DELETE /api/contacts/:id` 호출
- [ ] **5-5-3** 성공 시 목록에서 해당 항목 제거

---

## Phase 6. 스타일링

- [ ] **6-1** 전체 레이아웃 및 기본 스타일 (Tailwind CSS 또는 CSS Modules)
- [ ] **6-2** 테이블 스타일링 (행 hover, 줄무늬 등)
- [ ] **6-3** 모달 스타일링 (오버레이, 애니메이션)
- [ ] **6-4** 반응형 레이아웃 적용 (모바일 대응)
- [ ] **6-5** 버튼 및 입력창 스타일 통일

---

## Phase 7. 유효성 검사

- [ ] **7-1** 이름: 공백만 입력 불가
- [ ] **7-2** 전화번호: 숫자와 하이픈만 허용, 최소 9자리 이상
- [ ] **7-3** 이메일: 형식 검사 (입력 시에만, 선택 항목)
- [ ] **7-4** 중복 전화번호 등록 시 사용자에게 명확한 에러 메시지 표시

---

## Phase 8. 배포

- [ ] **8-1** GitHub 저장소 생성 및 코드 푸시
- [ ] **8-2** Vercel에서 GitHub 저장소 연결
- [ ] **8-3** Vercel 환경 변수 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] **8-4** 배포 후 실제 URL로 CRUD 전체 기능 동작 확인
- [ ] **8-5** 모바일 환경에서 레이아웃 및 기능 확인

---

## Phase 9. 통합 테스트

- [ ] **9-1** 연락처 추가 — 정상 등록 확인
- [ ] **9-2** 연락처 추가 — 중복 전화번호 에러 확인
- [ ] **9-3** 연락처 추가 — 필수값 누락 에러 확인
- [ ] **9-4** 연락처 수정 — 데이터 변경 후 목록 반영 확인
- [ ] **9-5** 연락처 삭제 — 삭제 확인 후 목록에서 제거 확인
- [ ] **9-6** 검색 — 이름/전화번호 검색 결과 확인
- [ ] **9-7** 검색 결과 없음 — 빈 상태 메시지 확인

---

## 파일 구조 (참고)

```
sad-phonebook/
├── app/
│   ├── page.tsx                  # 메인 페이지
│   ├── layout.tsx
│   └── api/
│       └── contacts/
│           ├── route.ts          # GET, POST
│           └── [id]/
│               └── route.ts     # PUT, DELETE
├── components/
│   ├── ContactForm.tsx
│   ├── ContactTable.tsx
│   ├── Modal.tsx
│   └── SearchBar.tsx
├── lib/
│   └── supabase.ts
├── types/
│   └── contact.ts
├── .env.local
└── package.json
```
