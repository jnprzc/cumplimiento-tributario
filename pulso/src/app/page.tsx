'use client';

import { useState, useRef } from 'react';
import { ScoreCircle } from '@/components/ScoreCircle';
import { Dashboard } from '@/components/Dashboard';
import type { DiagnosisResult } from '@/types';

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatNIT(nit: string): string {
  return nit.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
}

const SAMPLE_NITS = [
  '890903938',
  '860034313',
  '890900608',
  '800197268',
  '900123456',
  '900234567',
  '900111111',
];

// ─── Phase types ──────────────────────────────────────────────────────────────

type Phase = 'idle' | 'loading' | 'result' | 'gate' | 'dashboard';

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
      <div className="max-w-2xl mx-auto px-5 py-8 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-blue-200 mb-2">
          Pulso
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
          Diagnóstico Tributario
          <br />
          <span className="text-blue-200">para tu empresa</span>
        </h1>
        <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-md mx-auto">
          Conoce el nivel de cumplimiento de tus obligaciones fiscales en segundos.
          Gratis · Sin registro.
        </p>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-12 py-8">
      <div className="max-w-2xl mx-auto px-5 text-center space-y-2">
        <p className="text-xs text-slate-400">
          Los datos se consultan de fuentes públicas: RUES, DIAN y Cámaras de Comercio.
          No almacenamos información tributaria confidencial.
        </p>
        <p className="text-xs text-slate-400">
          Protección de datos — Ley 1581 de 2012 ·{' '}
          <a href="/privacidad" className="underline hover:text-blue-600">
            Política de privacidad
          </a>
        </p>
        <p className="text-xs text-slate-300 pt-1">
          © {new Date().getFullYear()} Pulso · MVP v0.1
        </p>
      </div>
    </footer>
  );
}

// ─── NIT input phase ──────────────────────────────────────────────────────────

interface NitFormProps {
  onSubmit: (nit: string) => void;
  error: string;
}

function NitForm({ onSubmit, error }: NitFormProps) {
  const [value, setValue] = useState('');

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value.replace(/\D/g, '').slice(0, 9));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.length === 9) onSubmit(value);
  }

  return (
    <div className="animate-fade-in max-w-xl mx-auto mt-8 sm:mt-12">
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-1">
            Ingresa el NIT de tu empresa
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            9 dígitos sin puntos ni dígito de verificación
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{9}"
              value={value}
              onChange={handleInput}
              placeholder="Ej: 890903938"
              aria-label="NIT de la empresa"
              className="flex-1 h-12 px-4 rounded-xl border border-slate-300 text-slate-900 font-mono text-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-slate-300"
            />
            <button
              type="submit"
              disabled={value.length !== 9}
              className="h-12 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed
                         text-white disabled:text-slate-400 font-semibold rounded-xl transition-colors whitespace-nowrap"
            >
              Consultar →
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600 font-medium">
              {error}
            </p>
          )}
        </div>
      </form>

      {/* Sample NITs hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 mb-2">NITs de prueba disponibles:</p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {SAMPLE_NITS.map((nit) => (
            <button
              key={nit}
              onClick={() => onSubmit(nit)}
              className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-500
                         hover:border-blue-400 hover:text-blue-600 font-mono transition-colors"
            >
              {nit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Loading phase ────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Consultando fuentes oficiales…</p>
    </div>
  );
}

// ─── Result preview phase ─────────────────────────────────────────────────────

interface ResultPreviewProps {
  result: DiagnosisResult;
  onContinue: () => void;
  onReset: () => void;
}

function ResultPreview({ result, onContinue, onReset }: ResultPreviewProps) {
  return (
    <div className="animate-fade-in max-w-xl mx-auto mt-8 sm:mt-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-5">
          <ScoreCircle score={result.score} nivel={result.nivel} size="lg" />

          <div className="text-center">
            <p className="text-xl font-extrabold text-slate-900">{result.empresa.razon_social}</p>
            <p className="text-sm text-slate-500 mt-1 font-mono">
              NIT {formatNIT(result.nit)}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {result.empresa.municipio}, {result.empresa.departamento}
            </p>
          </div>

          <div className="w-full border-t border-slate-100 pt-5 space-y-3">
            <p className="text-sm text-slate-600 text-center">
              Hemos evaluado <strong>7 señales de cumplimiento</strong>. Para ver el
              análisis detallado, continúa con tu correo.
            </p>
            <button
              onClick={onContinue}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Ver diagnóstico completo →
            </button>
            <button
              onClick={onReset}
              className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Consultar otro NIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Email gate phase ─────────────────────────────────────────────────────────

interface EmailGateProps {
  onSubmit: (email: string) => void;
}

function EmailGate({ onSubmit }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Ingresa un correo válido.');
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError('');
    onSubmit(email);
  }

  return (
    <div className="animate-fade-in max-w-md mx-auto mt-8 sm:mt-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="text-3xl mb-3">📊</div>
          <h2 className="text-xl font-bold text-slate-900">Tu diagnóstico está listo</h2>
          <p className="text-sm text-slate-500 mt-1">
            Ingresa tu correo para ver el análisis completo de cumplimiento.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@empresa.com"
            aria-label="Correo electrónico"
            className="w-full h-12 px-4 rounded-xl border border-slate-300 text-slate-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder:text-slate-300"
          />
          {error && (
            <p role="alert" className="text-sm text-red-600 font-medium">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                       text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? 'Abriendo dashboard…' : 'Ver mi diagnóstico completo →'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400 text-center leading-relaxed">
          Solo te enviaremos tu informe. Sin spam.
          <br />
          Ley 1581 de 2012 — Protección de datos.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [nit, setNit] = useState('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState('');

  async function handleNitSubmit(inputNit: string) {
    setPhase('loading');
    setError('');
    try {
      const res = await fetch('/api/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nit: inputNit }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Error al consultar');
      setResult(data as DiagnosisResult);
      setNit(inputNit);
      setPhase('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido. Intenta de nuevo.');
      setPhase('idle');
    }
  }

  async function handleEmailSubmit(email: string) {
    // Non-blocking lead capture
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nit, score: result?.score }),
    }).catch(() => {});
    setPhase('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setPhase('idle');
    setResult(null);
    setNit('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-2">
        {phase === 'idle' && <NitForm onSubmit={handleNitSubmit} error={error} />}
        {phase === 'loading' && <LoadingState />}
        {phase === 'result' && result && (
          <ResultPreview
            result={result}
            onContinue={() => setPhase('gate')}
            onReset={reset}
          />
        )}
        {phase === 'gate' && <EmailGate onSubmit={handleEmailSubmit} />}
        {phase === 'dashboard' && result && (
          <div className="mt-6">
            <Dashboard result={result} onReset={reset} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
