-- ============================================================
-- Seed: 개발/테스트용 샘플 데이터
-- ============================================================

INSERT INTO public.contacts (name, phone, email, memo) VALUES
  ('홍길동',   '010-1234-5678', 'hong@example.com',  '회사 동료'),
  ('김철수',   '010-2345-6789', 'kim@example.com',   '대학 친구'),
  ('이영희',   '010-3456-7890', 'lee@example.com',   NULL),
  ('박민준',   '010-4567-8901', NULL,                '고객사 담당자'),
  ('최수진',   '010-5678-9012', 'choi@example.com',  '팀장님')
ON CONFLICT (phone) DO NOTHING;
