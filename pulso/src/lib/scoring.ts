import { QUESTIONS } from './questions';
import type {
  DiagnosticResult,
  DiagnosticLevel,
  CategoryScores,
  Recommendation,
} from '@/types';

function getLevel(score: number): DiagnosticLevel {
  if (score <= 30) return 'Crítico';
  if (score <= 55) return 'En riesgo';
  if (score <= 75) return 'Estable';
  return 'Saludable';
}

function generateFindings(
  answers: Record<number, string>,
  scores: CategoryScores,
): string[] {
  const findings: string[] = [];

  // ── Cashflow (highest weight — surface critical issues first) ──────────────
  if (answers[8] === '0') {
    findings.push(
      'Tu negocio no tiene reservas: sin ventas nuevas, no sobreviviría ni un mes.',
    );
  } else if (answers[2] === 'No') {
    findings.push(
      'Este mes no alcanza para pagar proveedores o nómina — señal de alerta crítica.',
    );
  } else if (answers[6] === 'Sí') {
    findings.push('Tienes deudas vencidas que pueden paralizar tu operación.');
  } else if (answers[1] === 'No') {
    findings.push(
      'No sabes cuánto dinero mueve tu negocio — todo lo demás es imposible sin ese dato.',
    );
  } else {
    const pct = scores.cashflow.score / scores.cashflow.maxScore;
    findings.push(
      pct >= 0.7
        ? 'Tu flujo de caja está controlado — buena base para crecer.'
        : 'Tu flujo de caja tiene vulnerabilidades que pueden crecer con el tiempo.',
    );
  }

  // ── Sales / clients ────────────────────────────────────────────────────────
  if (answers[3] === '0' && answers[9] === 'No') {
    findings.push(
      'No conseguiste clientes nuevos y no tienes clientes fijos — el ingreso es impredecible.',
    );
  } else if (answers[4] === 'No') {
    findings.push(
      'Tus ventas bajaron este mes — hay una tendencia negativa que atender pronto.',
    );
  } else if (answers[3] === '0') {
    findings.push(
      'No conseguiste clientes nuevos el mes pasado — el crecimiento está estancado.',
    );
  } else {
    const pct = scores.sales.score / scores.sales.maxScore;
    findings.push(
      pct >= 0.65
        ? 'Tu área de ventas muestra un buen ritmo.'
        : 'Hay oportunidades de mejora en cómo consigues y retienes clientes.',
    );
  }

  // ── Management ────────────────────────────────────────────────────────────
  if (answers[7] === 'No') {
    findings.push(
      'Sin registros de ingresos y gastos es imposible mejorar lo que no se mide.',
    );
  } else if (answers[11] === 'No') {
    findings.push(
      'No sabes cuánto te cuesta cada producto — podrías estar vendiéndolos a pérdida.',
    );
  } else {
    const pct = scores.management.score / scores.management.maxScore;
    findings.push(
      pct >= 0.6
        ? 'Tu gestión básica tiene buenas bases para seguir mejorando.'
        : 'Fortalecer la gestión básica puede multiplicar los resultados del negocio.',
    );
  }

  return findings.slice(0, 3);
}

function generateRecommendations(
  answers: Record<number, string>,
): Recommendation[] {
  const recs: Recommendation[] = [];

  // ── Cashflow recs ─────────────────────────────────────────────────────────
  if (answers[1] === 'No') {
    recs.push({
      title: 'Controla tu caja cada día',
      description:
        'Dedica 10 minutos al día a anotar lo que entra y lo que sale. Una libreta sirve.',
      priority: 'high',
      category: 'cashflow',
    });
  }
  if (answers[2] === 'No') {
    recs.push({
      title: 'Habla con tus proveedores esta semana',
      description:
        'Pide ampliar plazos de pago o pacta cuotas. La mayoría prefiere eso a perder el cliente.',
      priority: 'high',
      category: 'cashflow',
    });
  }
  if (answers[6] === 'Sí') {
    recs.push({
      title: 'Paga primero las deudas que generan multas',
      description:
        'Liquida las obligaciones con intereses más altos antes de reinvertir en el negocio.',
      priority: 'high',
      category: 'cashflow',
    });
  }
  if (answers[8] === '0' || answers[8] === '1-2') {
    recs.push({
      title: 'Empieza un fondo de emergencia',
      description:
        'Aparta el 5% de cada venta en una cuenta separada hasta tener 2 meses de gastos fijos.',
      priority: answers[8] === '0' ? 'high' : 'medium',
      category: 'cashflow',
    });
  }

  // ── Sales recs ────────────────────────────────────────────────────────────
  if (answers[4] === 'No') {
    recs.push({
      title: 'Llama a tus últimos 5 clientes',
      description:
        'Pregúntales por qué compraron menos. Esa conversación vale más que cualquier análisis.',
      priority: 'high',
      category: 'sales',
    });
  }
  if (answers[3] === '0') {
    recs.push({
      title: 'Activa el canal de referidos',
      description:
        'Pide a tus 3 mejores clientes que te recomienden. Ofrece un descuento por cada referido.',
      priority: 'medium',
      category: 'sales',
    });
  }
  if (answers[9] === 'No') {
    recs.push({
      title: 'Identifica y fideliza tus mejores clientes',
      description:
        'Tener 3 clientes fijos estabiliza el ingreso. Dales un trato especial para retenerlos.',
      priority: 'medium',
      category: 'sales',
    });
  }
  if (answers[10] !== 'Sí') {
    recs.push({
      title: 'Revisa tu estructura de precios',
      description:
        'Con la inflación actual, no actualizar precios puede hacerte operar a pérdida sin notarlo.',
      priority: 'medium',
      category: 'sales',
    });
  }

  // ── Management recs ───────────────────────────────────────────────────────
  if (answers[7] === 'No') {
    recs.push({
      title: 'Empieza a registrar hoy — gratis',
      description:
        'Descarga una app gratuita (Wave, Alegra Lite) o usa una hoja de cálculo sencilla.',
      priority: 'high',
      category: 'management',
    });
  }
  if (answers[11] === 'No') {
    recs.push({
      title: 'Calcula el costo real de tus productos',
      description:
        'Suma materiales + tiempo + transporte. Si no sabes el costo, no sabes si estás ganando.',
      priority: 'medium',
      category: 'management',
    });
  }
  if (answers[5] === 'No') {
    recs.push({
      title: 'Identifica tu producto estrella',
      description:
        'Haz una lista de tus productos y calcula cuál te deja más ganancia neta. Potencia ese.',
      priority: 'medium',
      category: 'management',
    });
  }
  if (answers[12] === 'No') {
    recs.push({
      title: 'Crea un colchón de emergencia',
      description:
        'Abre una cuenta separada y aparta mínimo el 5% de cada venta. Pequeño, pero constante.',
      priority: 'medium',
      category: 'management',
    });
  }

  // High-priority first, then medium
  recs.sort((a, b) => (a.priority === 'high' && b.priority !== 'high' ? -1 : 1));

  return recs.slice(0, 5);
}

export function calculateScore(answers: Record<number, string>): DiagnosticResult {
  let cashflow = 0;
  let sales = 0;
  let management = 0;

  for (const question of QUESTIONS) {
    const answer = answers[question.id];
    if (!answer) continue;
    const option = question.options.find((o) => o.value === answer);
    if (!option) continue;

    if (question.category === 'cashflow') cashflow += option.points;
    else if (question.category === 'sales') sales += option.points;
    else management += option.points;
  }

  const score = cashflow + sales + management;

  const categoryScores: CategoryScores = {
    cashflow: { score: cashflow, maxScore: 40, label: 'Flujo de Caja', emoji: '💰' },
    sales: { score: sales, maxScore: 35, label: 'Ventas y Clientes', emoji: '📈' },
    management: { score: management, maxScore: 25, label: 'Gestión Básica', emoji: '📋' },
  };

  return {
    score,
    level: getLevel(score),
    categoryScores,
    findings: generateFindings(answers, categoryScores),
    recommendations: generateRecommendations(answers),
  };
}
