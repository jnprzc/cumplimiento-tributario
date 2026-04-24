'use client';

import { useEffect, useState } from 'react';
import { PulsoLogo } from '@/components/PulsoLogo';
import { ScoreCircle } from '@/components/ScoreCircle';
import type { DiagnosticResult } from '@/types';

const STORAGE_KEY = 'pulso_last_result';
const HISTORY_KEY = 'pulso_score_history';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function radarData(result: DiagnosticResult) {
  const sales = (result.categoryScores.sales.score / result.categoryScores.sales.maxScore) * 100;
  const cash  = (result.categoryScores.cashflow.score / result.categoryScores.cashflow.maxScore) * 100;
  const mgmt  = (result.categoryScores.management.score / result.categoryScores.management.maxScore) * 100;
  return [
    { axis: 'Ventas',     value: Math.round(sales) },
    { axis: 'Liquidez',   value: Math.round(cash * 0.9 + mgmt * 0.1) },
    { axis: 'Costos',     value: Math.round(mgmt * 0.7 + cash * 0.3) },
    { axis: 'Ahorro',     value: Math.round(cash * 0.85) },
    { axis: 'Equilibrio', value: Math.round(result.score) },
    { axis: 'Deudas',     value: Math.round(cash * 0.65 + mgmt * 0.35) },
  ];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ─── Native SVG Radar Chart ───────────────────────────────────────────────────

function RadarChartSVG({ data }: { data: { axis: string; value: number }[] }) {
  const SIZE = 260;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = 88;
  const n = data.length;

  function polar(angleDeg: number, r: number) {
    const a = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  const angles = data.map((_, i) => (360 / n) * i);
  const levels = [25, 50, 75, 100];

  const dataPoints = data.map((d, i) => polar(angles[i], (d.value / 100) * R));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height={SIZE}>
      {/* Grid polygons */}
      {levels.map(level => {
        const pts = angles.map(a => {
          const p = polar(a, (level / 100) * R);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(' ');
        return <polygon key={level} points={pts} fill="none" stroke="#e2e8f0" strokeWidth="1" />;
      })}

      {/* Axis spokes */}
      {angles.map((angle, i) => {
        const outer = polar(angle, R);
        return <line key={i} x1={cx} y1={cy} x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)}
          stroke="#e2e8f0" strokeWidth="1" />;
      })}

      {/* Data fill */}
      <path d={dataPath} fill="#2D7A4F" fillOpacity="0.25" stroke="#2D7A4F" strokeWidth="2" strokeLinejoin="round" />

      {/* Dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill="#2D7A4F" stroke="white" strokeWidth="1.5" />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const p = polar(angles[i], R + 22);
        return (
          <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="10.5" fontWeight="600" fill="#475569">
            {d.axis}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Native SVG Line Chart ────────────────────────────────────────────────────

function LineChartSVG({ data }: { data: { date: string; score: number }[] }) {
  const W = 320, H = 180;
  const pad = { t: 16, r: 16, b: 36, l: 36 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;

  const xPos = (i: number) =>
    data.length < 2 ? pad.l + cw / 2 : pad.l + (i / (data.length - 1)) * cw;
  const yPos = (v: number) => pad.t + ch - (v / 100) * ch;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xPos(i).toFixed(1)},${yPos(d.score).toFixed(1)}`).join(' ');
  const areaPath = linePath + ` L${xPos(data.length - 1).toFixed(1)},${(pad.t + ch).toFixed(1)} L${xPos(0).toFixed(1)},${(pad.t + ch).toFixed(1)} Z`;

  const yTicks = [0, 50, 100];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%">
      {/* Y grid + labels */}
      {yTicks.map(t => (
        <g key={t}>
          <line x1={pad.l} y1={yPos(t)} x2={W - pad.r} y2={yPos(t)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={pad.l - 6} y={yPos(t)} textAnchor="end" dominantBaseline="middle"
            fontSize="9" fill="#94a3b8">{t}</text>
        </g>
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text key={i} x={xPos(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.date}</text>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="#2D7A4F" fillOpacity="0.08" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#2D7A4F" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots + score labels */}
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={xPos(i)} cy={yPos(d.score)} r="4.5" fill="#2D7A4F" stroke="white" strokeWidth="2" />
          <text x={xPos(i)} y={yPos(d.score) - 10} textAnchor="middle" fontSize="9.5"
            fontWeight="700" fill="#2D7A4F">{d.score}</text>
        </g>
      ))}
    </svg>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0]">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-2xl mx-auto"><PulsoLogo size="sm" /></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-pulso-50 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#2D7A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">Sin diagnóstico todavía</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-xs leading-snug">
          Completa tu primer diagnóstico para ver el análisis detallado aquí.
        </p>
        <a href="/"
          className="inline-flex py-3.5 px-8 bg-pulso hover:bg-pulso-600 text-white font-bold rounded-2xl transition-colors">
          Hacer diagnóstico →
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiagnosticoPage() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setResult(JSON.parse(saved) as DiagnosticResult);
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) setHistory(JSON.parse(hist) as { date: string; score: number }[]);
    } catch {}
  }, []);

  if (!result) return <EmptyState />;

  const radar = radarData(result);
  const historyChart = history.map(h => ({ date: formatDate(h.date), score: h.score }));

  const LEVEL_COLOR: Record<DiagnosticResult['level'], string> = {
    Crítico:     '#dc2626',
    'En riesgo': '#F59E0B',
    Estable:     '#F59E0B',
    Saludable:   '#2D7A4F',
  };
  const levelColor = LEVEL_COLOR[result.level];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-5 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <PulsoLogo size="sm" />
            <p className="text-xs font-bold text-pulso uppercase tracking-widest mt-1">
              Diagnóstico detallado
            </p>
          </div>
          <a href="/"
            className="text-xs text-pulso font-semibold border border-pulso/30 px-3 py-1.5 rounded-full hover:bg-pulso-50 transition-colors">
            Nuevo diagnóstico
          </a>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 pt-6 pb-28 md:pb-10">

        {/* Score summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex items-center gap-5 mb-6">
          <ScoreCircle score={result.score} level={result.level} size="sm" />
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Resultado actual</p>
            <p className="text-2xl font-extrabold mt-0.5" style={{ color: levelColor }}>
              {result.level}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">Score: {result.score} / 100</p>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Radar chart */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Perfil de tu negocio
            </p>
            <h2 className="text-base font-extrabold text-slate-900 mb-4">Análisis por dimensión</h2>
            <div className="flex justify-center">
              <RadarChartSVG data={radar} />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {radar.map(({ axis, value }) => (
                <div key={axis} className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2">
                  <span className="text-xs font-semibold text-slate-600">{axis}</span>
                  <span className="text-xs font-bold tabular-nums"
                    style={{ color: value >= 70 ? '#2D7A4F' : value >= 50 ? '#d97706' : '#dc2626' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Score history */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Evolución
            </p>
            <h2 className="text-base font-extrabold text-slate-900 mb-4">Historial de puntajes</h2>

            {historyChart.length < 2 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-500">Aún no hay historial</p>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  Completa más diagnósticos para ver tu evolución aquí.
                </p>
              </div>
            ) : (
              <LineChartSVG data={historyChart} />
            )}

            {history.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {history.slice(-5).map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-slate-50 rounded-xl px-3 py-2">
                    <span className="text-xs text-slate-500">{formatDate(h.date)}</span>
                    <span className="text-xs font-bold" style={{
                      color: h.score >= 76 ? '#2D7A4F' : h.score >= 56 ? '#d97706' : '#dc2626',
                    }}>
                      {h.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="mt-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-0.5">
            Desglose por categoría
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.values(result.categoryScores).map(cat => {
              const pct = Math.round((cat.score / cat.maxScore) * 100);
              const col = pct >= 70 ? '#2D7A4F' : pct >= 50 ? '#d97706' : '#dc2626';
              return (
                <div key={cat.label} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-800">{cat.emoji} {cat.label}</span>
                    <span className="text-lg font-extrabold tabular-nums" style={{ color: col }}>
                      {pct}<span className="text-sm font-normal text-slate-400">%</span>
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: col }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{cat.score} / {cat.maxScore} puntos</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-8 leading-relaxed">
          Diagnóstico orientativo. No reemplaza asesoría profesional. Ley 1581 de 2012.
        </p>
      </main>
    </div>
  );
}
