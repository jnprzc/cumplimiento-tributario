'use client';

import { ScoreCircle } from './ScoreCircle';
import type { DiagnosticResult, CategoryScore, Recommendation } from '@/types';

// ─── Category progress bar ────────────────────────────────────────────────────

function CategoryCard({ cat }: { cat: CategoryScore }) {
  const pct = Math.round((cat.score / cat.maxScore) * 100);
  const barColor =
    pct >= 70
      ? 'bg-emerald-500'
      : pct >= 50
      ? 'bg-yellow-400'
      : pct >= 30
      ? 'bg-orange-400'
      : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-800 text-sm">
          {cat.emoji} {cat.label}
        </span>
        <span className="text-sm font-bold tabular-nums text-slate-600">
          {cat.score}
          <span className="text-slate-400 font-normal">/{cat.maxScore}</span>
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400 mt-1.5 text-right">{pct}%</p>
    </div>
  );
}

// ─── Recommendation item ──────────────────────────────────────────────────────

const PRIORITY_BADGE: Record<Recommendation['priority'], string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
};

const PRIORITY_LABEL: Record<Recommendation['priority'], string> = {
  high: 'Urgente',
  medium: 'Importante',
};

const CATEGORY_LABEL: Record<Recommendation['category'], string> = {
  cashflow: 'Flujo de Caja',
  sales: 'Ventas',
  management: 'Gestión',
};

function RecItem({ rec, index }: { rec: Recommendation; index: number }) {
  return (
    <div className="flex gap-3 p-4 bg-white rounded-2xl border border-slate-200">
      <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <p className="text-sm font-bold text-slate-900">{rec.title}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${PRIORITY_BADGE[rec.priority]}`}
          >
            {PRIORITY_LABEL[rec.priority]}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-snug">{rec.description}</p>
        <p className="text-xs text-slate-400 mt-1">{CATEGORY_LABEL[rec.category]}</p>
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

interface DashboardProps {
  result: DiagnosticResult;
  onReset: () => void;
}

const LEVEL_DESCRIPTION: Record<DiagnosticResult['level'], string> = {
  Crítico: 'Tu negocio necesita atención urgente',
  'En riesgo': 'Hay señales de alerta que debes atender',
  Estable: 'Vas bien pero hay oportunidades de mejora',
  Saludable: 'Tu negocio tiene bases sólidas',
};

export function Dashboard({ result, onReset }: DashboardProps) {
  const { score, level, categoryScores, findings, recommendations } = result;
  const showCorenta = score < 40;

  return (
    <div className="animate-fade-in space-y-5 pb-12">

      {/* Score header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row gap-5 items-center">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
            Tu diagnóstico
          </p>
          <h2 className="text-xl font-extrabold text-slate-900">{LEVEL_DESCRIPTION[level]}</h2>
          <p className="text-sm text-slate-500 mt-1">
            Evaluamos 12 aspectos clave de tu negocio
          </p>
        </div>
        <ScoreCircle score={score} level={level} size="lg" />
      </div>

      {/* Corenta CTA — only when score < 40 */}
      {showCorenta && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
          <div className="flex gap-3 items-start">
            <span className="text-2xl mt-0.5">⚠️</span>
            <div>
              <p className="font-bold text-amber-900 text-sm">
                ¿Necesitas ayuda?
              </p>
              <p className="text-sm text-amber-800 mt-1 leading-snug">
                Un contador de Corenta puede orientarte gratis sobre tus próximos pasos.
                Especialistas en microempresas colombianas.
              </p>
              <a
                href="https://corenta.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700"
              >
                Hablar con un contador de Corenta →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Findings */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">
          3 hallazgos principales
        </h3>
        <div className="space-y-2">
          {findings.map((finding, i) => (
            <div
              key={i}
              className="flex gap-3 p-3.5 bg-white rounded-xl border border-slate-200"
            >
              <span className="text-lg mt-0.5">{i === 0 ? '🔍' : i === 1 ? '📊' : '💡'}</span>
              <p className="text-sm text-slate-700 leading-snug">{finding}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">Desglose por área</h3>
        <div className="space-y-2">
          {(Object.values(categoryScores) as CategoryScore[]).map((cat) => (
            <CategoryCard key={cat.label} cat={cat} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Plan de acción recomendado
          </h3>
          <p className="text-sm text-slate-500 mb-3">Priorizado por impacto en tu negocio</p>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <RecItem key={i} rec={rec} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Legal */}
      <p className="text-xs text-slate-400 text-center leading-relaxed px-2">
        Este diagnóstico es orientativo y no reemplaza asesoría financiera o contable
        profesional. Ley 1581 de 2012 — Protección de datos personales.
      </p>

      <button
        onClick={onReset}
        className="w-full py-3 text-sm text-slate-400 hover:text-blue-600 transition-colors"
      >
        ← Hacer otro diagnóstico
      </button>
    </div>
  );
}
