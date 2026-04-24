'use client';

import { useEffect, useState } from 'react';
import type { DiagnosticLevel } from '@/types';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 339.29

// Green for healthy, amber for warning, red for critical
const LEVEL_COLOR: Record<DiagnosticLevel, string> = {
  Saludable:  '#2D7A4F',
  Estable:    '#F59E0B',
  'En riesgo': '#F59E0B',
  Crítico:    '#dc2626',
};

const LEVEL_BADGE: Record<DiagnosticLevel, string> = {
  Saludable:  'bg-pulso-50 text-pulso-600',
  Estable:    'bg-amber-50 text-amber-700',
  'En riesgo': 'bg-amber-50 text-amber-700',
  Crítico:    'bg-red-50 text-red-700',
};

interface ScoreCircleProps {
  score: number;
  level: DiagnosticLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreCircle({ score, level, size = 'md' }: ScoreCircleProps) {
  const [displayed, setDisplayed] = useState(0);
  const [offset, setOffset] = useState(CIRCUMFERENCE);

  useEffect(() => {
    setDisplayed(0);
    setOffset(CIRCUMFERENCE);
    let frame = 0;
    const FRAMES = 45;
    const id = setInterval(() => {
      frame++;
      const t = frame / FRAMES;
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(score * eased));
      setOffset(CIRCUMFERENCE * (1 - (score * eased) / 100));
      if (frame >= FRAMES) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [score]);

  const dim = size === 'lg' ? 176 : size === 'sm' ? 96 : 140;
  const scoreFontSize = size === 'sm' ? '20' : '26';
  const labelFontSize = size === 'sm' ? '9' : '11';
  const color = LEVEL_COLOR[level];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 120 120"
        aria-label={`Puntuación ${score} de 100 — ${level}`}
      >
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#e8e8e3" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="54" textAnchor="middle" dominantBaseline="middle"
          fontSize={scoreFontSize} fontWeight="700" fill="#1a1a1a">
          {displayed}
        </text>
        <text x="60" y="72" textAnchor="middle" dominantBaseline="middle"
          fontSize={labelFontSize} fill="#9ca3af">
          /100
        </text>
      </svg>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${LEVEL_BADGE[level]}`}>
        {level}
      </span>
    </div>
  );
}
