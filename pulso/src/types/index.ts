export type DiagnosticLevel = 'Crítico' | 'En riesgo' | 'Estable' | 'Saludable';
export type QuestionCategory = 'cashflow' | 'sales' | 'management';

export interface QuestionOption {
  label: string;
  value: string;
  points: number;
}

export interface Question {
  id: number;
  text: string;
  category: QuestionCategory;
  options: QuestionOption[];
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  label: string;
  emoji: string;
}

export interface CategoryScores {
  cashflow: CategoryScore;
  sales: CategoryScore;
  management: CategoryScore;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium';
  category: QuestionCategory;
}

export interface DiagnosticResult {
  score: number;
  level: DiagnosticLevel;
  categoryScores: CategoryScores;
  findings: string[];
  recommendations: Recommendation[];
}
