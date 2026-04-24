'use client';

import Link from 'next/link';
import { ScoreCircle } from './ScoreCircle';
import { BottomNav } from './BottomNav';
import type { DiagnosticResult, CategoryScore, Recommendation } from '@/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function weekLabel(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7,
  );
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `Sem. ${week} · ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ─── Category progress bar ────────────────────────────────────────────────────

function barColor(pct: number) {
  if (pct >= 70) return 'bg-pulso';
  if (pct >= 50) return 'bg-amber-400';
  if (pct >= 30) return 'bg-orange-400';
  return 'bg-red-500';
}

function CategoryCard({ cat }: { cat: CategoryScore }) {
  const pct = Math.round((cat.score / cat.maxScore) * 100);
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-800 text-sm">
          {cat.emoji} {cat.label}
        </span>
        <span className="text-sm font-bold tabular-nums text-slate-600">
          {cat.score}<span className="text-slate-400 font-normal">/{cat.maxScore}</span>
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Recommendation item ──────────────────────────────────────────────────────

const PRIORITY_BADGE: Record<Recommendation['priority'], string> = {
  high:   'bg-red-50 text-red-700',
  medium: 'bg-amber-50 text-amber-700',
};
const PRIORITY_LABEL: Record<Recommendation['priority'], string> = {
  high:   'Urgente',
  medium: 'Importante',
};
const CATEGORY_LABEL: Record<Recommendation['category'], string> = {
  cashflow:   'Flujo de Caja',
  sales:      'Ventas',
  management: 'Gestión',
};

function RecItem({ rec, index }: { rec: Recommendation; index: number }) {
  return (
    <div className="flex gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
      <span className="shrink-0 w-7 h-7 rounded-full bg-pulso text-white text-xs font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <p className="text-sm font-bold text-slate-900">{rec.title}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${PRIORITY_BADGE[rec.priority]}`}>
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

const LEVEL_TITLE: Record<DiagnosticResult['level'], string> = {
  Crítico:    'Empresa en alerta',
  'En riesgo': 'Empresa en riesgo',
  Estable:    'Empresa en desarrollo',
  Saludable:  'Empresa saludable',
};

interface DashboardProps {
  result: DiagnosticResult;
  businessName?: string;
  onReset: () => void;
}

export function Dashboard({ result, businessName = 'Tu negocio', onReset }: DashboardProps) {
  const { score, level, categoryScores, findings, recommendations } = result;
  const showCorenta = score < 40;
  const topRec = recommendations[0];

  return (
    <div className="animate-fade-in space-y-4 pb-28">

      {/* ── Score header ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4">
        <ScoreCircle score={score} level={level} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Salud empresarial
          </p>
          <p className="text-base font-extrabold text-slate-900 leading-tight mt-0.5">
            {LEVEL_TITLE[level]}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{businessName}</p>
        </div>
        <span className="text-xs text-slate-400 shrink-0 text-right leading-snug">
          {weekLabel()}
        </span>
      </div>

      {/* ── Corenta CTA — score < 40 ──────────────────────── */}
      {showCorenta && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
          <div className="flex gap-3 items-start">
            <span className="text-amber-500 text-lg mt-0.5">⚠</span>
            <div>
              <p className="font-bold text-amber-900 text-sm">¿Necesitas ayuda?</p>
              <p className="text-sm text-amber-800 mt-1 leading-snug">
                Un contador de Corenta puede orientarte gratis sobre tus próximos pasos.
              </p>
              <a href="https://corenta.co" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-700">
                Hablar con Corenta →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Alert card — top weak signal ─────────────────── */}
      {topRec && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4 flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm">{topRec.title}</p>
            <p className="text-sm text-slate-600 mt-0.5 leading-snug">{topRec.description}</p>
          </div>
        </div>
      )}

      {/* ── Tu próximo paso ───────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-0.5">
          Tu próximo paso
        </p>
        <Link href="/aprender">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
            <div className="h-28 bg-pulso-200/60 flex items-center justify-center relative">
              <div className="w-12 h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#2D7A4F">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <p className="font-bold text-slate-900 text-sm">Flujo de caja en 5 pasos</p>
              <p className="text-xs text-slate-500 mt-0.5">Lección 2 · 12 min</p>
              <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-pulso rounded-full w-1/3" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ── Check-in CTA ──────────────────────────────────── */}
      <Link href="/check-in">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-center gap-4 active:scale-[0.98] transition-transform">
          <div className="w-10 h-10 rounded-xl bg-pulso-50 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#2D7A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <polyline points="9,16 11,18 15,14"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 text-sm">Check-in semanal pendiente</p>
            <p className="text-xs text-slate-500">3 preguntas · ~1 min</p>
          </div>
          <span className="bg-pulso text-white text-sm font-bold px-4 py-2 rounded-xl shrink-0">
            Hacer
          </span>
        </div>
      </Link>

      {/* ── Divider ───────────────────────────────────────── */}
      <div className="border-t border-slate-200 pt-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-0.5">
          Diagnóstico completo
        </p>
      </div>

      {/* ── Hallazgos ─────────────────────────────────────── */}
      <div className="space-y-2">
        {findings.map((finding, i) => (
          <div key={i} className="flex gap-3 p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
            <span className="text-base mt-0.5 shrink-0">{i === 0 ? '🔍' : i === 1 ? '📊' : '💡'}</span>
            <p className="text-sm text-slate-700 leading-snug">{finding}</p>
          </div>
        ))}
      </div>

      {/* ── Category breakdown ────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-0.5">
          Desglose por área
        </p>
        <div className="space-y-2">
          {(Object.values(categoryScores) as CategoryScore[]).map((cat) => (
            <CategoryCard key={cat.label} cat={cat} />
          ))}
        </div>
      </div>

      {/* ── Recommendations ───────────────────────────────── */}
      {recommendations.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 px-0.5">
            Plan de acción
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <RecItem key={i} rec={rec} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Legal ─────────────────────────────────────────── */}
      <p className="text-xs text-slate-400 text-center leading-relaxed px-2 pt-2">
        Diagnóstico orientativo. No reemplaza asesoría profesional.
        Ley 1581 de 2012.
      </p>

      <button onClick={onReset}
        className="w-full py-3 text-sm text-slate-400 hover:text-pulso transition-colors">
        ← Hacer nuevo diagnóstico
      </button>

      <BottomNav />
    </div>
  );
}
