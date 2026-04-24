'use client';

import { PulsoLogo } from '@/components/PulsoLogo';

// ─── Lesson data ──────────────────────────────────────────────────────────────

type LessonStatus = 'done' | 'current' | 'locked';

interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  status: LessonStatus;
  unlockCondition?: string;
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Conoce tu flujo de caja',
    subtitle: 'Los fundamentos de la liquidez',
    duration: '8 min',
    status: 'done',
  },
  {
    id: 2,
    title: 'Flujo de caja en 5 pasos',
    subtitle: 'Método práctico para micronegocios',
    duration: '12 min',
    status: 'current',
  },
  {
    id: 3,
    title: 'Cómo proyectar tus ventas',
    subtitle: 'Estimación simple para la próxima semana',
    duration: '10 min',
    status: 'locked',
    unlockCondition: 'Completa la lección 2',
  },
  {
    id: 4,
    title: 'Consigue clientes recurrentes',
    subtitle: 'Estrategias de bajo costo para fidelizar',
    duration: '15 min',
    status: 'locked',
    unlockCondition: 'Haz 2 check-ins semanales',
  },
];

// ─── Lesson node ──────────────────────────────────────────────────────────────

function LessonNode({ lesson, isLast }: { lesson: Lesson; isLast: boolean }) {
  const isDone = lesson.status === 'done';
  const isCurrent = lesson.status === 'current';
  const isLocked = lesson.status === 'locked';

  return (
    <div className="flex gap-4">
      {/* Timeline column */}
      <div className="flex flex-col items-center">
        {/* Node circle */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10
            ${isDone ? 'bg-pulso' : isCurrent ? 'bg-white border-2 border-pulso' : 'bg-white border-2 border-dashed border-slate-300'}`}
        >
          {isDone && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {isCurrent && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#2D7A4F">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
          {isLocked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          )}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1 mb-1 min-h-[2rem]
            ${isDone ? 'bg-pulso' : 'bg-slate-200'}`} />
        )}
      </div>

      {/* Card */}
      <div className={`flex-1 mb-4 rounded-2xl border-2 p-4 transition-all
        ${isCurrent
          ? 'border-pulso bg-white shadow-md'
          : isDone
          ? 'border-slate-200 bg-white'
          : 'border-slate-200 bg-slate-50 opacity-70'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className={`font-bold text-sm leading-snug
                ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                {lesson.title}
              </p>
              {isCurrent && (
                <span className="text-xs bg-pulso text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                  En curso
                </span>
              )}
              {isDone && (
                <span className="text-xs bg-pulso-50 text-pulso font-bold px-2 py-0.5 rounded-full shrink-0">
                  Completada
                </span>
              )}
            </div>
            <p className={`text-xs leading-snug ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
              {lesson.subtitle}
            </p>
            {isLocked && lesson.unlockCondition && (
              <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                {lesson.unlockCondition}
              </p>
            )}
          </div>
          <span className={`text-xs font-medium shrink-0 ${isLocked ? 'text-slate-300' : 'text-slate-400'}`}>
            {lesson.duration}
          </span>
        </div>

        {isCurrent && (
          <button className="mt-3 w-full py-2.5 bg-pulso hover:bg-pulso-600 text-white font-bold rounded-xl text-sm transition-colors">
            Continuar lección →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AprenderPage() {
  const completedCount = LESSONS.filter((l) => l.status === 'done').length;
  const progressPct = Math.round((completedCount / LESSONS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 pt-4 pb-3">
        <div className="max-w-2xl mx-auto">
          <PulsoLogo size="sm" />
          <p className="text-xs font-bold text-pulso uppercase tracking-widest mt-3">
            Tu ruta personalizada
          </p>
          <div className="flex items-center justify-between mt-1 mb-2">
            <h1 className="text-lg font-extrabold text-slate-900">
              Finanzas para micronegocios
            </h1>
            <span className="text-sm font-bold text-slate-400 tabular-nums shrink-0 ml-2">
              {completedCount}/{LESSONS.length}
            </span>
          </div>
          {/* Route progress */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-pulso rounded-full transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lesson timeline */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-5 pt-6 pb-28 md:pb-10">
        {LESSONS.map((lesson, i) => (
          <LessonNode key={lesson.id} lesson={lesson} isLast={i === LESSONS.length - 1} />
        ))}

        <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed px-4">
          Las lecciones se desbloquean según tu progreso y check-ins semanales.
        </p>
      </main>
    </div>
  );
}
