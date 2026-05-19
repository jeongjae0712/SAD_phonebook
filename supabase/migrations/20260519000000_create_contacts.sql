-- ============================================================
-- Migration: create_contacts
-- ============================================================

-- 1. uuid 생성 확장 활성화
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. contacts 테이블 생성
CREATE TABLE IF NOT EXISTS contacts (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  phone      VARCHAR(20)  NOT NULL UNIQUE,
  email      VARCHAR(200),
  memo       TEXT,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 3. updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 4. updated_at 트리거
DROP TRIGGER IF EXISTS trg_contacts_updated_at ON contacts;
CREATE TRIGGER trg_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. RLS 활성화
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- 6. 기존 정책 제거 (재실행 시 중복 오류 방지)
DROP POLICY IF EXISTS "contacts_select_all" ON contacts;
DROP POLICY IF EXISTS "contacts_insert_all" ON contacts;
DROP POLICY IF EXISTS "contacts_update_all" ON contacts;
DROP POLICY IF EXISTS "contacts_delete_all" ON contacts;

-- 7. RLS 공개 정책 설정
CREATE POLICY "contacts_select_all" ON contacts FOR SELECT USING (true);
CREATE POLICY "contacts_insert_all" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_update_all" ON contacts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "contacts_delete_all" ON contacts FOR DELETE USING (true);

-- 8. 검색 성능용 인덱스
CREATE INDEX IF NOT EXISTS idx_contacts_name  ON contacts (name);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts (phone);
