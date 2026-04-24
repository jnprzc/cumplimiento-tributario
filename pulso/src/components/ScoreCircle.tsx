'use client';

import { useEffect, useState } from 'react';
import type { ComplianceLevel } from '@/types';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 339.29

const LEVEL_COLOR: Record<ComplianceLevel, string> = {
  Premium: '#10b981',
  Confiable: '#f59e0b',
  Básico: '#ef4444',
};

const LEVEL_BG: Record<ComplianceLevel, string> = {
  Premium: 'bg-emerald-100 text-emerald-700',
  Confiable: 'bg-amber-100 text-amber-700',
  Básico: 'bg-red-100 text-red-700',
};

interface ScoreCircleProps {
  score: number;
  nivel: ComplianceLevel;
  size?: 'md' | 'lg';
}

export function ScoreCircle({ score, nivel, size = 'md' }: ScoreCircleProps) {
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

  const dim = size === 'lg' ? 180 : 140;
  const color = LEVEL_COLOR[nivel];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 120 120"
        aria-label={`Score ${score} de 100 — ${nivel}`}
      >
        {/* Track */}
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        {/* Progress */}
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
        {/* Score text */}
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
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${LEVEL_BG[nivel]}`}>
        {nivel}
      </span>
    </div>
  );
}
