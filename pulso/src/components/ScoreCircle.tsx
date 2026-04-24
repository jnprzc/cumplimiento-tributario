'use client';

import { useEffect, useState } from 'react';
import type { DiagnosticLevel } from '@/types';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 339.29

const LEVEL_COLOR: Record<DiagnosticLevel, string> = {
  Saludable: '#16a34a',
  Estable: '#ca8a04',
  'En riesgo': '#ea580c',
  Crítico: '#dc2626',
};

const LEVEL_BADGE: Record<DiagnosticLevel, string> = {
  Saludable: 'bg-emerald-100 text-emerald-700',
  Estable: 'bg-yellow-100 text-yellow-800',
  'En riesgo': 'bg-orange-100 text-orange-700',
  Crítico: 'bg-red-100 text-red-700',
};

interface ScoreCircleProps {
  score: number;
  level: DiagnosticLevel;
  size?: 'md' | 'lg';
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
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplayed(Math.round(score * eased));
      setOffset(CIRCUMFERENCE * (1 - (score * eased) / 100));
      if (frame >= FRAMES) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [score]);

  const dim = size === 'lg' ? 176 : 140;
  const color = LEVEL_COLOR[level];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 120 120"
        aria-label={`Puntuación ${score} de 100 — ${level}`}
      >
        {/* Track */}
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        {/* Progress arc */}
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        {/* Score number */}
        <text
          x="60"
          y="54"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="26"
          fontWeight="700"
          fill="#0f172a"
        >
          {displayed}
        </text>
        <text
          x="60"
          y="72"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fill="#94a3b8"
        >
          /100
        </text>
      </svg>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${LEVEL_BADGE[level]}`}>
        {level}
      </span>
    </div>
  );
}
