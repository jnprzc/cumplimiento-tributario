import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email: string = String(body.email ?? '').trim().toLowerCase();
  const nit: string = String(body.nit ?? '').replace(/\D/g, '');
  const score: number = Number(body.score ?? 0);

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Correo inválido.' }, { status: 400 });
  }

  try {
    const db = createServerClient();
    await db.from('leads').insert({ email, nit, score });
  } catch {
    // Non-blocking — dashboard access continues regardless
  }

  return NextResponse.json({ ok: true });
}
