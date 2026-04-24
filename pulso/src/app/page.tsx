'use client';

import { useState, useRef } from 'react';
import { QUESTIONS } from '@/lib/questions';
import { calculateScore } from '@/lib/scoring';
import { ScoreCircle } from '@/components/ScoreCircle';
import { Dashboard } from '@/components/Dashboard';
import type { DiagnosticResult } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = 'landing' | 'quiz' | 'calculating' | 'result' | 'gate' | 'dashboard';

// ─── Header ───────────────────────────────────────────────────────────────────

function PulsoLogo() {
  return (
    <span className="font-black text-blue-600 text-xl tracking-tight">
      💓 Pulso
    </span>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-slate-900 via-blue-950 to-blue-900 text-white">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-6 select-none">💓</div>
          <h1 className="text-5xl font-black tracking-tight mb-3">Pulso</h1>
          <p className="text-2xl font-semibold text-blue-200 leading-tight mb-2">
            Sabe cómo está tu negocio.
          </p>
          <p className="text-2xl font-semibold text-blue-300 leading-tight mb-8">
            Antes de que sea tarde.
          </p>
          <button
            onClick={onStart}
            className="w-full bg-blue-500 hover:bg-blue-400 active:scale-95 text-white
                       font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-150 shadow-lg shadow-blue-900/40"
          >
            Hacer diagnóstico gratis
          </button>
          <p className="mt-4 text-sm text-blue-300">
            12 preguntas · 3 minutos · Sin registro
          </p>
        </div>
      </div>

      {/* Value props */}
      <div className="bg-slate-50 px-6 py-10">
        <div className="max-w-sm mx-auto space-y-5">
          {[
            ['🔍', 'Diagnóstico honesto', 'Evalúa flujo de caja, ventas, clientes y gestión básica.'],
            ['📊', 'Resultado en segundos', 'Score 0-100 con tu nivel: Crítico, En riesgo, Estable o Saludable.'],
            ['🎯', 'Plan de acción claro', 'Recomendaciones priorizadas en lenguaje simple, sin tecnicismos.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="flex gap-4 items-start">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-bold text-slate-800 text-sm">{title}</p>
                <p className="text-sm text-slate-500 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200">
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
  const progress = ((questionIndex) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 pt-3 pb-0">
        <div className="max-w-lg mx-auto flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors"
          >
            ← Atrás
          </button>
          <PulsoLogo />
          <span className="text-sm font-medium text-slate-400 tabular-nums">
            {questionIndex + 1} / {QUESTIONS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-lg mx-auto w-full animate-fade-in">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Pregunta {questionIndex + 1} de {QUESTIONS.length}
        </p>
        <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-8">
          {question.text}
        </h2>

        {/* Answer buttons */}
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = previousAnswer === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onAnswer(option.value)}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-semibold text-base
                            transition-all duration-100 active:scale-[0.98]
                            ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50/50'
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
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-lg font-bold text-slate-900">Analizando tu negocio…</p>
        <p className="text-sm text-slate-500 mt-1">Calculando tu diagnóstico personalizado</p>
      </div>
    </div>
  );
}

// ─── Result preview ───────────────────────────────────────────────────────────

interface ResultPreviewProps {
  result: DiagnosticResult;
  onContinue: () => void;
  onReset: () => void;
}

function ResultPreview({ result, onContinue, onReset }: ResultPreviewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-5 py-4 bg-white border-b border-slate-100 flex justify-center">
        <PulsoLogo />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 w-full max-w-sm animate-fade-in">
          <div className="flex flex-col items-center gap-5">
            <ScoreCircle score={result.score} level={result.level} size="lg" />

            <div className="w-full border-t border-slate-100 pt-5">
              <p className="text-sm font-bold text-slate-800 mb-3">
                Tus 3 hallazgos principales:
              </p>
              <ul className="space-y-2">
                {result.findings.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600 leading-snug">
                    <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full space-y-2 pt-1">
              <button
                onClick={onContinue}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98]
                           text-white font-bold rounded-2xl transition-all"
              >
                Ver mi plan de acción →
              </button>
              <button
                onClick={onReset}
                className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="px-5 py-4 bg-white border-b border-slate-100 flex justify-center">
        <PulsoLogo />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7 w-full max-w-sm animate-fade-in">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">📬</div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Recibe tu plan de acción personalizado
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
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                         text-white font-bold rounded-2xl transition-colors"
            >
              {loading ? 'Abriendo tu diagnóstico…' : 'Ver diagnóstico completo →'}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center leading-relaxed">
            Sin spam. Solo tu plan de acción.
            <br />
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
        setResult(calculateScore(newAnswers));
        setPhase('result');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 1400);
    }
  }

  function goBack() {
    if (currentIndex === 0) {
      setPhase('landing');
    } else {
      setCurrentIndex((i) => i - 1);
    }
  }

  function handleEmailSubmit(email: string) {
    // Non-blocking save to Supabase
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        score: result?.score,
        level: result?.level,
        responses: answers,
      }),
    }).catch(() => {});

    setPhase('dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function reset() {
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
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-10 px-5 py-4 bg-white border-b border-slate-100 flex justify-center">
          <PulsoLogo />
        </header>
        <main className="max-w-xl mx-auto px-4 py-6">
          <Dashboard result={result} onReset={reset} />
        </main>
      </div>
    );
  }

  return null;
}
