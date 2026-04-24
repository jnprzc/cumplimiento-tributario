import { NextRequest, NextResponse } from 'next/server';
import { calcularScore } from '@/lib/compliance';
import { getCompany } from '@/lib/companies';
import { createServerClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const rawNit: string = String(body.nit ?? '').replace(/\D/g, '');

  if (!/^\d{9}$/.test(rawNit)) {
    return NextResponse.json(
      { error: 'NIT inválido. Ingresa los 9 dígitos sin puntos ni guiones.' },
      { status: 400 },
    );
  }

  const empresa = getCompany(rawNit);
  if (!empresa) {
    return NextResponse.json(
      { error: 'NIT no encontrado en nuestra base de datos de ejemplo.' },
      { status: 404 },
    );
  }

  const result = calcularScore(empresa);

  // Persist diagnosis — non-blocking
  try {
    const db = createServerClient();
    await db.from('diagnoses').insert({
      nit: rawNit,
      company_data: empresa,
      score: result.score,
    });
  } catch {
    // Silently continue if DB is unavailable during local dev
  }

  return NextResponse.json(result);
}
