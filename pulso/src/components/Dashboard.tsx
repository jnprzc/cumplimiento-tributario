'use client';

import { ScoreCircle } from './ScoreCircle';
import type { DiagnosisResult } from '@/types';

function formatNIT(nit: string): string {
  return nit.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
}

interface SignalRowProps {
  icono: string;
  nombre: string;
  activa: boolean;
  puntos_obtenidos: number;
  puntos_maximos: number;
  descripcion: string;
}

function SignalRow({ icono, nombre, activa, puntos_obtenidos, puntos_maximos, descripcion }: SignalRowProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${
      activa ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'
    }`}>
      <span className="text-xl leading-none mt-0.5">{icono}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-semibold text-slate-800">{nombre}</p>
          <span className={`text-xs font-bold tabular-nums ${
            activa ? 'text-emerald-600' : 'text-slate-400'
          }`}>
            {puntos_obtenidos}/{puntos_maximos}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{descripcion}</p>
      </div>
      <span className="text-base mt-0.5">{activa ? '✅' : '⭕'}</span>
    </div>
  );
}

interface DashboardProps {
  result: DiagnosisResult;
  onReset: () => void;
}

export function Dashboard({ result, onReset }: DashboardProps) {
  const { empresa, score, nivel, senales, proximos_pasos } = result;
  const showCorenta = score < 50;

  return (
    <div className="animate-fade-in space-y-6 pb-10">

      {/* Company header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-slate-900 truncate">{empresa.razon_social}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            NIT {formatNIT(empresa.nit)} · {empresa.municipio}, {empresa.departamento}
          </p>
          <p className="text-xs text-slate-400 mt-1 leading-snug">
            {empresa.actividad_principal} (CIIU {empresa.codigo_ciiu})
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              empresa.estado === 'ACTIVA'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-600'
            }`}>
              {empresa.estado}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {empresa.tamano}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {empresa.empleados_rango} empleados
            </span>
          </div>
        </div>
        <ScoreCircle score={score} nivel={nivel} size="lg" />
      </div>

      {/* Corenta CTA — only when score < 50 */}
      {showCorenta && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 animate-fade-in">
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-amber-800 text-sm">
                Tu empresa está en zona de riesgo tributario
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Un score de <strong>{score}/100</strong> indica obligaciones críticas sin cumplir.
                Corenta puede ayudarte a regularizar tu situación fiscal en menos de 30 días.
              </p>
              <a
                href="https://corenta.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900"
              >
                Conocer Corenta →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Compliance signals */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">
          Mapa de cumplimiento
          <span className="ml-2 text-sm font-normal text-slate-400">
            {result.senales_activas}/7 señales activas
          </span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {senales.map((s) => (
            <SignalRow key={s.nombre} {...s} />
          ))}
        </div>
      </div>

      {/* Tax responsibilities */}
      {empresa.responsabilidades_tributarias.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-3">Responsabilidades tributarias</h3>
          <div className="flex flex-wrap gap-2">
            {empresa.responsabilidades_tributarias.map((r) => (
              <span
                key={r}
                className="text-xs px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium"
              >
                {r}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Registration info */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">Datos registrales</h3>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {[
            ['Tipo de sociedad', empresa.tipo_sociedad],
            ['Cámara de comercio', empresa.camara],
            ['Fecha de matrícula', empresa.fecha_matricula],
            ['Última renovación', empresa.ultima_renovacion],
            ['Estado renovación 2024', empresa.estado_renovacion_2024],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start gap-3 px-4 py-3">
              <span className="text-xs text-slate-500 w-40 shrink-0 pt-0.5">{label}</span>
              <span className="text-xs font-medium text-slate-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      {proximos_pasos.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-3">Próximos pasos recomendados</h3>
          <ol className="space-y-2">
            {proximos_pasos.map((paso, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-snug pt-0.5">{paso}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Legal disclaimer */}
      <p className="text-xs text-slate-400 text-center leading-relaxed">
        Este diagnóstico se basa en datos de fuentes públicas (RUES, DIAN, Cámaras de Comercio)
        con fines informativos. No constituye asesoría jurídica ni tributaria.
        Ley 1581 de 2012 — Protección de datos personales.
      </p>

      <button
        onClick={onReset}
        className="w-full py-3 text-sm text-slate-500 hover:text-blue-600 transition-colors"
      >
        ← Consultar otro NIT
      </button>
    </div>
  );
}
