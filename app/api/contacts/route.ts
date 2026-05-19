import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function isValidPhone(phone: string): boolean {
  return /^[\d\-+\s()]{9,20}$/.test(phone.trim());
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  let query = supabase
    .from('contacts')
    .select('*')
    .order('name', { ascending: true });

  if (q && q.trim()) {
    query = query.or(`name.ilike.%${q.trim()}%,phone.ilike.%${q.trim()}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, phone, email, memo } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 });
  }
  if (!phone || !phone.trim()) {
    return NextResponse.json({ error: '전화번호를 입력해주세요.' }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: '올바른 전화번호 형식이 아닙니다. (숫자, 하이픈, +만 허용)' }, { status: 400 });
  }
  if (email && email.trim() && !isValidEmail(email)) {
    return NextResponse.json({ error: '올바른 이메일 형식이 아닙니다.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert([{
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      memo: memo?.trim() || null,
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: '이미 등록된 전화번호입니다.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
