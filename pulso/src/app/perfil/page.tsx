'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { PulsoLogo } from '@/components/PulsoLogo';

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 text-center">
      <p className="text-2xl font-extrabold text-pulso tabular-nums">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{label}</p>
    </div>
  );
}

// ─── Editable field ───────────────────────────────────────────────────────────

function EditableField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest w-20 shrink-0">
        {label}
      </span>
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          placeholder={placeholder}
          className="flex-1 text-sm text-slate-900 font-medium border-b border-pulso outline-none bg-transparent pb-0.5"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex-1 text-left text-sm font-medium text-slate-800 hover:text-pulso transition-colors truncate"
        >
          {value || <span className="text-slate-300">{placeholder}</span>}
        </button>
      )}
      {!editing && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="shrink-0">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      )}
    </div>
  );
}

// ─── Certificate card ─────────────────────────────────────────────────────────

function CertificateCard({ name }: { name: string }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-pulso-100 shadow-sm overflow-hidden">
      {/* Certificate header bar */}
      <div className="h-2 bg-gradient-to-r from-pulso-600 via-pulso to-pulso-400" />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <PulsoLogo size="sm" />
          {/* Uninorte logo placeholder */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center">
              <span className="text-[8px] font-black text-slate-500">UN</span>
            </div>
            <span className="text-xs font-bold text-slate-400">Uninorte</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
          Certificado de progreso
        </p>
        <p className="text-base font-extrabold text-slate-900 leading-tight mb-0.5">
          {name || 'Tu nombre'}
        </p>
        <p className="text-xs text-slate-500">Finanzas para micronegocios · Módulo 1</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#d97706">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
          </div>
          <p className="text-xs text-slate-500">Aún en progreso — completa la ruta para desbloquear</p>
        </div>

        <button
          disabled
          className="mt-4 w-full py-2.5 bg-slate-100 text-slate-400 font-bold rounded-xl text-sm cursor-not-allowed"
        >
          Compartir certificado
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState('');
  const [ciudad, setCiudad] = useState('');

  const initials = businessName
    ? businessName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'TN';

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4F0]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-5 pt-5 pb-5">
        <div className="max-w-lg mx-auto">
          <PulsoLogo size="sm" />
          <div className="mt-4 flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-pulso flex items-center justify-center shrink-0">
              <span className="text-xl font-black text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-slate-900 text-base leading-tight truncate">
                {businessName || 'Tu negocio'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Miembro desde Abril 2026</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 pt-5 pb-28 space-y-4">

        {/* Stats */}
        <div className="flex gap-3">
          <StatPill value="4" label="Semanas activo" />
          <StatPill value="1" label="Rutas en progreso" />
        </div>

        {/* Business info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm px-5 pt-4 pb-2">
          <p className="text-xs font-bold text-pulso uppercase tracking-widest mb-1">
            Mi negocio
          </p>
          <EditableField
            label="Nombre"
            value={businessName}
            onChange={setBusinessName}
            placeholder="Nombre de tu negocio"
          />
          <EditableField
            label="Sector"
            value={sector}
            onChange={setSector}
            placeholder="Ej. Alimentos, Ropa…"
          />
          <EditableField
            label="Ciudad"
            value={ciudad}
            onChange={setCiudad}
            placeholder="Ej. Barranquilla"
          />
        </div>

        {/* Certificate */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 px-0.5">
            Mi certificado
          </p>
          <CertificateCard name={businessName} />
        </div>

        {/* Legal */}
        <p className="text-xs text-slate-400 text-center leading-relaxed pt-2 px-4">
          Datos guardados localmente en tu dispositivo.
          Ley 1581 de 2012 — Protección de datos.
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
