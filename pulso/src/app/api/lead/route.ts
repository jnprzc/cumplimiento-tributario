import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = String(body.email ?? '').trim().toLowerCase();
  const score: number = Number(body.score ?? 0);
  const level: string = String(body.level ?? '');
  const responses: Record<number, string> = body.responses ?? {};

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
  }

  try {
    const db = createServerClient();
    // Save full diagnostic record (email + responses + result)
    await db.from('diagnostics').insert({ email, responses, score, level });
    // Save lightweight lead record for CRM/marketing
    await db.from('leads').insert({ email, score, level });
  } catch {
    // Non-blocking — dashboard access continues even if DB is unavailable
  }

  return NextResponse.json({ ok: true });
}
