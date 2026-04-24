'use client';

import { useState, useRef, useEffect } from 'react';
import { QUESTIONS } from '@/lib/questions';
import { calculateScore } from '@/lib/scoring';
import { ScoreCircle } from '@/components/ScoreCircle';
import { Dashboard } from '@/components/Dashboard';
import { PulsoLogo } from '@/components/PulsoLogo';
import type { DiagnosticResult } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'landing' | 'quiz' | 'calculating' | 'result' | 'gate' | 'dashboard';

const STORAGE_KEY = 'pulso_last_result';

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
          <p className="text-2xl font-semibold text-pulso-100 leading-tight mb-2">
            Sabe cómo está tu negocio.
          </p>
          <p className="text-2xl font-semibold text-pulso-200 leading-tight mb-8">
            Antes de que sea tarde.
          </p>
          <button
            onClick={onStart}
            className="w-full bg-white hover:bg-pulso-50 active:scale-95 text-pulso font-bold
                       py-4 px-8 rounded-2xl text-lg transition-all duration-150 shadow-xl shadow-pulso-900/30"
          >
            Hacer diagnóstico gratis
          </button>
          <p className="mt-4 text-sm text-pulso-200">
            12 preguntas · 3 minutos · Sin registro
          </p>
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
        <div className="max-w-lg mx-auto flex items-center justify-between mb-3">
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

      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-lg mx-auto w-full animate-fade-in">
        <p className="text-xs font-semibold text-pulso uppercase tracking-widest mb-4">
          Pregunta {questionIndex + 1} de {QUESTIONS.length}
        </p>
        <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-8">
          {question.text}
        </h2>

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

// ─── Result preview ───────────────────────────────────────────────────────────

function ResultPreview({
  result,
  onContinue,
  onReset,
}: {
  result: DiagnosticResult;
  onContinue: () => void;
  onReset: () => void;
}) {
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
              <p className="text-sm font-bold text-slate-800 mb-3">
                Tus 3 hallazgos principales:
              </p>
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
                className="w-full py-3.5 bg-pulso hover:bg-pulso-600 active:scale-[0.98]
                           text-white font-bold rounded-2xl transition-all">
                Ver mi plan de acción →
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
            <h2 className="text-xl font-extrabold text-slate-900">
              Recibe tu plan de acción
            </h2>
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
  const [phase, setPhase] = useState<Phase>('landing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Restore last result from localStorage on first load
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setResult(JSON.parse(saved) as DiagnosticResult);
        setPhase('dashboard');
      }
    } catch {
      // ignore parse errors
    }
  }, []);

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

    // Persist so navigating back to / shows the dashboard
    try {
      if (result) localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch { /* ignore */ }

    setPhase('dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setPhase('landing');
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

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
      <div className="min-h-screen bg-[#F5F4F0]">
        <header className="sticky top-0 z-10 px-5 py-3.5 bg-white border-b border-slate-100 flex items-center justify-between max-w-xl mx-auto">
          <PulsoLogo />
          <button onClick={startQuiz}
            className="text-xs text-pulso font-semibold border border-pulso/30 px-3 py-1.5 rounded-full hover:bg-pulso-50 transition-colors">
            Nuevo diagnóstico
          </button>
        </header>
        <main className="max-w-xl mx-auto px-4 py-5">
          <Dashboard result={result} onReset={reset} />
        </main>
      </div>
    );
  }

  return null;
}
