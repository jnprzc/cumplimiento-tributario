'use client';

import { useState } from 'react';
import { PulsoLogo } from '@/components/PulsoLogo';
import { BottomNav } from '@/components/BottomNav';

// ─── Check-in questions (weekly pulse, 3 questions) ───────────────────────────

const CHECKIN_QUESTIONS = [
  {
    id: 1,
    text: '¿Cubriste todos tus gastos fijos esta semana?',
    options: ['Sí, sin problema', 'Parcialmente', 'No alcancé'],
  },
  {
    id: 2,
    text: '¿Tus ventas esta semana fueron similares o mejores que la semana pasada?',
    options: ['Sí, crecieron', 'Más o menos igual', 'No, bajaron'],
  },
  {
    id: 3,
    text: '¿Conseguiste al menos un cliente nuevo esta semana?',
    options: ['Sí', 'No, pero tengo prospectos', 'No'],
  },
];

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? 'bg-pulso w-8' : 'bg-slate-200 w-6'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Done screen ──────────────────────────────────────────────────────────────

function DoneScreen({ onRepeat }: { onRepeat: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-pulso-50 flex items-center justify-center mb-5">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="#2D7A4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 text-center">
        ¡Check-in completado!
      </h2>
      <p className="text-sm text-slate-500 mt-2 text-center leading-snug max-w-xs">
        Tus respuestas actualizan tu diagnóstico. Vuelve la próxima semana.
      </p>
      <div className="mt-8 w-full max-w-xs space-y-3">
        <a href="/aprender"
          className="block w-full py-3.5 bg-pulso hover:bg-pulso-600 text-white font-bold rounded-2xl transition-colors text-center">
          Ver mi ruta de aprendizaje →
        </a>
        <button onClick={onRepeat}
          className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-600 transition-colors">
          Repetir check-in
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckInPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const question = CHECKIN_QUESTIONS[currentIndex];
  const isLast = currentIndex === CHECKIN_QUESTIONS.length - 1;

  function handleNext() {
    if (!selected) return;
    if (isLast) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    }
  }

  function handleBack() {
    if (currentIndex === 0) {
      window.history.back();
    } else {
      setCurrentIndex((i) => i - 1);
      setSelected(null);
    }
  }

  function reset() {
    setCurrentIndex(0);
    setSelected(null);
    setDone(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 pt-4 pb-0">
        <div className="max-w-lg mx-auto flex items-center justify-between mb-4">
          <ProgressDots current={done ? 3 : currentIndex} total={CHECKIN_QUESTIONS.length} />
          <button onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {done ? (
        <DoneScreen onRepeat={reset} />
      ) : (
        <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-6 pt-10 pb-28 animate-fade-in">
          {/* Header */}
          <p className="text-xs font-bold text-pulso uppercase tracking-widest mb-4">
            Pregunta {currentIndex + 1} de {CHECKIN_QUESTIONS.length}
          </p>
          <h2 className="text-2xl font-bold text-slate-900 leading-snug mb-10">
            {question.text}
          </h2>

          {/* Options — radio style */}
          <div className="space-y-3 flex-1">
            {question.options.map((opt) => {
              const isActive = selected === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setSelected(opt)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left
                              font-semibold text-base transition-all duration-100 active:scale-[0.98]
                              ${isActive
                                ? 'border-pulso bg-pulso-50'
                                : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                              }`}
                >
                  {/* Radio circle */}
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                    ${isActive ? 'border-pulso bg-pulso' : 'border-slate-300 bg-white'}`}>
                    {isActive && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className={isActive ? 'text-pulso' : 'text-slate-800'}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Next button */}
          <div className="mt-10">
            <button
              onClick={handleNext}
              disabled={!selected}
              className="w-full py-4 bg-pulso hover:bg-pulso-600 disabled:bg-slate-200 disabled:text-slate-400
                         text-white font-bold rounded-2xl transition-colors text-base"
            >
              {isLast ? 'Finalizar ✓' : 'Siguiente →'}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
