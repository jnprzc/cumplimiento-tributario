'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PulsoLogo } from './PulsoLogo';

const TABS = [
  {
    href: '/',
    label: 'Inicio',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#2D7A4F' : 'none'}
        stroke={active ? '#2D7A4F' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    href: '/diagnostico',
    label: 'Diagnóstico',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2D7A4F' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: '/aprender',
    label: 'Aprender',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2D7A4F' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7l10-5 10 5-10 5L2 7z" />
        <path d="M6 10.5v5l6 3 6-3v-5" />
      </svg>
    ),
  },
  {
    href: '/perfil',
    label: 'Perfil',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#2D7A4F' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 flex-col bg-white border-r border-slate-200 z-50">
      <div className="px-5 py-5 border-b border-slate-100">
        <PulsoLogo />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {TABS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${active
                  ? 'bg-pulso-50 text-pulso'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              {icon(active)}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 leading-relaxed">
          Pulso · Sin costo · Sin registro<br />
          Ley 1581 de 2012
        </p>
      </div>
    </aside>
  );
}
