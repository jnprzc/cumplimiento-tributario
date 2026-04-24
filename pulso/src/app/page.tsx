'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { QUESTIONS } from '@/lib/questions';
import { calculateScore } from '@/lib/scoring';
import { ScoreCircle } from '@/components/ScoreCircle';
import { Dashboard } from '@/components/Dashboard';
import { PulsoLogo } from '@/components/PulsoLogo';
import type { DiagnosticResult } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'onboarding' | 'landing' | 'quiz' | 'calculating' | 'result' | 'gate' | 'dashboard';

const STORAGE_KEY   = 'pulso_last_result';
const ONBOARDED_KEY = 'pulso_onboarded';
const PROFILE_KEY   = 'pulso_profile';
const HISTORY_KEY   = 'pulso_score_history';

// ─── Onboarding ───────────────────────────────────────────────────────────────

interface OnboardingProps {
  onDone: (name: string, sector: string) => void;
}

function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');

  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16
                      bg-gradient-to-b from-pulso-800 via-pulso-700 to-pulso-600 text-white animate-fade-in">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-8">
            <svg width="40" height="28" viewBox="0 0 18 12" fill="none">
              <polyline points="1,6 4,6 6,1 8.5,11 11,6 14,6 15.5,3.5 17,6"
                stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-3">Bienvenido a Pulso</h1>
          <p className="text-lg text-pulso-100 leading-snug mb-2">Tu radar de salud empresarial.</p>
          <p className="text-base text-pulso-200 leading-snug mb-10">
            Diagnostica tu negocio en 3 minutos, gratis y sin registro.
          </p>
          <button onClick={() => setStep(1)}
            className="w-full bg-white hover:bg-pulso-50 active:scale-95 text-pulso font-bold
                       py-4 px-8 rounded-2xl text-lg transition-all duration-150 shadow-xl shadow-pulso-900/30">
            Comenzar →
          </button>
          <p className="mt-4 text-sm text-pulso-300">Solo 3 pasos · Sin datos personales requeridos</p>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#F5F4F0] animate-fade-in">
        <div className="max-w-sm w-full">
          <PulsoLogo />
          <h2 className="text-2xl font-extrabold text-slate-900 mt-6 mb-1">Cuéntanos sobre tu negocio</h2>
          <p className="text-sm text-slate-500 mb-8">Personaliza tu diagnóstico. Puedes dejarlo en blanco.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Nombre del negocio
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Panadería Doña Rosa"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 text-slate-900
                           focus:outline-none focus:ring-2 focus:ring-pulso focus:border-transparent
                           placeholder:text-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Sector o tipo de negocio
              </label>
              <input
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="Ej. Alimentos, Ropa, Servicios…"
                className="w-full h-12 px-4 rounded-xl border border-slate-300 text-slate-900
                           focus:outline-none focus:ring-2 focus:ring-pulso focus:border-transparent
                           placeholder:text-slate-300 bg-white"
              />
            </div>
          </div>

          <button onClick={() => setStep(2)}
            className="mt-8 w-full py-4 bg-pulso hover:bg-pulso-600 text-white font-bold rounded-2xl text-lg transition-colors">
            Continuar →
          </button>
          <button onClick={() => setStep(2)}
            className="mt-2 w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
            Saltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#F5F4F0] animate-fade-in">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-pulso-50 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#2D7A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">¡Listo para empezar!</h2>
        <p className="text-sm text-slate-500 mb-10 leading-snug">
          Responde 12 preguntas honestas sobre tu negocio y recibe tu diagnóstico gratuito.
        </p>

        <div className="space-y-3 mb-10 text-left">
          {[
            ['⏱', '3 minutos', 'Sin perder tiempo'],
            ['🎯', '12 preguntas', 'Sobre ventas, liquidez y gestión'],
            ['📊', 'Score 0-100', 'Con plan de acción personalizado'],
          ].map(([icon, title, desc]) => (
            <div key={String(title)} className="flex gap-3 items-center bg-white rounded-xl p-3 border border-slate-200/80">
              <span className="text-xl">{icon}</span>
              <div>
                <p className="font-bold text-slate-800 text-sm">{title}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => onDone(name.trim(), sector.trim())}
          className="w-full py-4 bg-pulso hover:bg-pulso-600 active:scale-95 text-white font-bold rounded-2xl text-lg transition-all shadow-lg shadow-pulso-900/20">
          Hacer diagnóstico gratis →
        </button>
      </div>
    </div>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16
                      bg-gradient-to-b from-pulso-800 via-pulso-700 to-pulso-600 text-white">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="24" viewBox="0 0 18 12" fill="none">
              <polyline points="1,6 4,6 6,1 8.5,11 11,6 14,6 15.5,3.5 17,6"
                stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-3">pulso</h1>
          <p className="text-2xl font-semibold text-pulso-100 leading-tight mb-2">Sabe cómo está tu negocio.</p>
          <p className="text-2xl font-semibold text-pulso-200 leading-tight mb-8">Antes de que sea tarde.</p>
          <button onClick={onStart}
            className="w-full bg-white hover:bg-pulso-50 active:scale-95 text-pulso font-bold
                       py-4 px-8 rounded-2xl text-lg transition-all duration-150 shadow-xl shadow-pulso-900/30">
            Hacer diagnóstico gratis
          </button>
          <p className="mt-4 text-sm text-pulso-200">12 preguntas · 3 minutos · Sin registro</p>
        </div>
      </div>

      <div className="bg-[#F5F4F0] px-6 py-10">
        <div className="max-w-sm mx-auto space-y-5">
          {[
            ['🔍', 'Diagnóstico honesto', 'Evalúa flujo de caja, ventas, clientes y gestión básica.'],
            ['📊', 'Resultado en segundos', 'Score 0-100: Crítico, En riesgo, Estable o Saludable.'],
            ['🎯', 'Plan de acción claro', 'Recomendaciones priorizadas en lenguaje simple.'],
          ].map(([icon, title, desc]) => (
            <div key={String(title)} className="flex gap-4 items-start">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-bold text-slate-800 text-sm">{title}</p>
                <p className="text-sm text-slate-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200 bg-white">
        Pulso · Sin costo · Sin registro · Ley 1581 de 2012
      </footer>
    </div>
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

interface QuizProps {
  questionIndex: number;
  previousAnswer?: string;
  onAnswer: (value: string) => void;
  onBack: () => void;
}

function QuizScreen({ questionIndex, previousAnswer, onAnswer, onBack }: QuizProps) {
  const question = QUESTIONS[questionIndex];
  const progress = (questionIndex / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 pt-3 pb-0">
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-3">
          <button onClick={onBack}
            className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
            ← Atrás
          </button>
          <PulsoLogo size="sm" />
          <span className="text-sm font-medium text-slate-400 tabular-nums">
            {questionIndex + 1} / {QUESTIONS.length}
          </span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-pulso rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-2xl mx-auto w-full animate-fade-in">
        <p className="text-xs font-semibold text-pulso uppercase tracking-widest mb-4">
          Pregunta {questionIndex + 1} de {QUESTIONS.length}
        </p>
        <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-8">{question.text}</h2>

        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = previousAnswer === option.value;
            return (
              <button key={option.value} onClick={() => onAnswer(option.value)}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-semibold text-base
                            transition-all duration-100 active:scale-[0.98]
                            ${isSelected
                              ? 'border-pulso bg-pulso-50 text-pulso'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-pulso-300 hover:bg-pulso-50/40'
                            }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Calculating ──────────────────────────────────────────────────────────────

function CalculatingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 bg-white animate-fade-in px-6">
      <div className="w-12 h-12 border-4 border-pulso-100 border-t-pulso rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-lg font-bold text-slate-900">Analizando tu negocio…</p>
        <p className="text-sm text-slate-500 mt-1">Calculando tu diagnóstico personalizado</p>
      </div>
    </div>
  );
}

// ─── Share image (native Canvas 2D, no external deps) ────────────────────────

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

async function generateShareImage(result: DiagnosticResult): Promise<Blob | null> {
  const LEVEL_COLOR: Record<DiagnosticResult['level'], string> = {
    Crítico:     '#dc2626',
    'En riesgo': '#F59E0B',
    Estable:     '#F59E0B',
    Saludable:   '#2D7A4F',
  };
  const color = LEVEL_COLOR[result.level];
  const dpr = 2;
  const W = 400, H = 280;

  const canvas = document.createElement('canvas');
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(dpr, dpr);

  ctx.fillStyle = '#ffffff';
  rrect(ctx, 0, 0, W, H, 16);
  ctx.fill();

  ctx.fillStyle = '#2D7A4F';
  ctx.fillRect(0, 0, W, 8);

  ctx.fillStyle = '#0f172a';
  ctx.font = '800 20px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('pulso', 32, 50);

  ctx.fillStyle = color;
  ctx.font = '900 80px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(String(result.score), W / 2, 155);

  ctx.fillStyle = '#64748b';
  ctx.font = '400 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('sobre 100', W / 2, 175);

  ctx.font = '700 14px system-ui, -apple-system, sans-serif';
  const bw = ctx.measureText(result.level).width + 32;
  ctx.fillStyle = color + '22';
  rrect(ctx, W / 2 - bw / 2, 188, bw, 28, 14);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.fillText(result.level, W / 2, 207);

  ctx.strokeStyle = '#f1f5f9';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, 232);
  ctx.lineTo(W - 32, 232);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 11px system-ui, -apple-system, sans-serif';
  ctx.fillText('Diagnóstico de salud empresarial · pulso.co', W / 2, 258);

  return new Promise((resolve) => { canvas.toBlob((blob) => resolve(blob), 'image/png'); });
}

async function doShare(blob: Blob) {
  if (navigator.share) {
    try {
      await navigator.share({ files: [new File([blob], 'pulso.png', { type: 'image/png' })], title: 'Mi diagnóstico Pulso' });
      return;
    } catch {}
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'mi-diagnostico-pulso.png'; a.click();
  URL.revokeObjectURL(url);
}

// ─── Result preview ───────────────────────────────────────────────────────────

function ResultPreview({
  result, onContinue, onReset,
}: { result: DiagnosticResult; onContinue: () => void; onReset: () => void }) {
  const [sharing, setSharing] = useState(false);

  async function handleShare() {
    setSharing(true);
    try {
      const blob = await generateShareImage(result);
      if (blob) await doShare(blob);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0]">
      <header className="px-5 py-4 bg-white border-b border-slate-100 flex justify-center">
        <PulsoLogo />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-7 w-full max-w-sm animate-fade-in">
          <div className="flex flex-col items-center gap-5">
            <ScoreCircle score={result.score} level={result.level} size="lg" />
            <div className="w-full border-t border-slate-100 pt-5">
              <p className="text-sm font-bold text-slate-800 mb-3">Tus 3 hallazgos principales:</p>
              <ul className="space-y-2">
                {result.findings.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600 leading-snug">
                    <span className="text-pulso-300 mt-0.5 shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full space-y-2 pt-1">
              <button onClick={onContinue}
                className="w-full py-3.5 bg-pulso hover:bg-pulso-600 active:scale-[0.98] text-white font-bold rounded-2xl transition-all">
                Ver mi plan de acción →
              </button>
              <button onClick={handleShare} disabled={sharing}
                className="w-full py-3 text-sm text-pulso font-semibold border border-pulso/30
                           rounded-2xl hover:bg-pulso-50 transition-colors disabled:opacity-50">
                {sharing ? 'Generando imagen…' : '↗ Compartir resultado'}
              </button>
              <button onClick={onReset}
                className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
                ← Repetir diagnóstico
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Email gate ───────────────────────────────────────────────────────────────

function EmailGate({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Ingresa un correo válido.');
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    onSubmit(trimmed);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0]">
      <header className="px-5 py-4 bg-white border-b border-slate-100 flex justify-center">
        <PulsoLogo />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-7 w-full max-w-sm animate-fade-in">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-pulso-50 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#2D7A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Recibe tu plan de acción</h2>
            <p className="text-sm text-slate-500 mt-2 leading-snug">
              Ingresa tu correo para ver el diagnóstico completo y las recomendaciones.
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <input
              ref={inputRef}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="correo@tunegocio.com"
              aria-label="Correo electrónico"
              className="w-full h-12 px-4 rounded-xl border border-slate-300 text-slate-900
                         focus:outline-none focus:ring-2 focus:ring-pulso focus:border-transparent
                         placeholder:text-slate-300"
            />
            {error && <p role="alert" className="text-sm text-red-600 font-medium">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-pulso hover:bg-pulso-600 disabled:bg-pulso-300
                         text-white font-bold rounded-2xl transition-colors">
              {loading ? 'Abriendo tu diagnóstico…' : 'Ver diagnóstico completo →'}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-400 text-center leading-relaxed">
            Sin spam. Solo tu plan de acción.<br />
            Ley 1581 de 2012 — Protección de datos.
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    try {
      const onboarded = localStorage.getItem(ONBOARDED_KEY);
      if (!onboarded) { setPhase('onboarding'); return; }

      const profile = localStorage.getItem(PROFILE_KEY);
      if (profile) {
        const p = JSON.parse(profile) as { name?: string };
        if (p.name) setBusinessName(p.name);
      }

      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setResult(JSON.parse(saved) as DiagnosticResult);
        setPhase('dashboard');
      } else {
        setPhase('landing');
      }
    } catch {
      setPhase('landing');
    }
  }, []);

  function finishOnboarding(name: string, sector: string) {
    try {
      localStorage.setItem(ONBOARDED_KEY, '1');
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, sector }));
    } catch {}
    setBusinessName(name);
    setPhase('landing');
  }

  function startQuiz() {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setPhase('quiz');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function handleAnswer(value: string) {
    const question = QUESTIONS[currentIndex];
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setPhase('calculating');
      setTimeout(() => {
        const r = calculateScore(newAnswers);
        setResult(r);
        setPhase('result');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 1400);
    }
  }

  function goBack() {
    if (currentIndex === 0) setPhase('landing');
    else setCurrentIndex((i) => i - 1);
  }

  function handleEmailSubmit(email: string) {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, score: result?.score, level: result?.level, responses: answers }),
    }).catch(() => {});

    try {
      if (result) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') as { date: string; score: number }[];
        history.push({ date: new Date().toISOString(), score: result.score });
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      }
    } catch {}

    setPhase('dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setPhase('landing');
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  const handleShare = useCallback(async () => {
    if (!result) return;
    const blob = await generateShareImage(result);
    if (blob) await doShare(blob);
  }, [result]);

  if (phase === 'loading') return null;
  if (phase === 'onboarding') return <Onboarding onDone={finishOnboarding} />;
  if (phase === 'landing') return <Landing onStart={startQuiz} />;
  if (phase === 'quiz') {
    return (
      <QuizScreen
        questionIndex={currentIndex}
        previousAnswer={answers[QUESTIONS[currentIndex].id]}
        onAnswer={handleAnswer}
        onBack={goBack}
      />
    );
  }
  if (phase === 'calculating') return <CalculatingScreen />;
  if (phase === 'result' && result) {
    return (
      <ResultPreview
        result={result}
        onContinue={() => { setPhase('gate'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
        onReset={reset}
      />
    );
  }
  if (phase === 'gate') return <EmailGate onSubmit={handleEmailSubmit} />;
  if (phase === 'dashboard' && result) {
    return (
      <>
        <div className="min-h-screen bg-[#F5F4F0]">
          <header className="sticky top-0 z-10 px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between">
            <PulsoLogo />
            <button onClick={startQuiz}
              className="text-xs text-pulso font-semibold border border-pulso/30 px-3 py-1.5 rounded-full hover:bg-pulso-50 transition-colors">
              Nuevo diagnóstico
            </button>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-5">
            <Dashboard result={result} businessName={businessName} onReset={reset} onShare={handleShare} />
          </main>
        </div>
      </>
    );
  }
  return null;
}
