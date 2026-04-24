import type { Question } from '@/types';

// Scoring weights: cashflow 40 pts | sales 35 pts | management 25 pts = 100 total

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: '¿Sabes cuánto dinero entra y sale de tu negocio cada semana?',
    category: 'cashflow',
    options: [
      { label: 'Sí, lo sé', value: 'Sí', points: 10 },
      { label: 'No, no lo tengo claro', value: 'No', points: 0 },
    ],
  },
  {
    id: 2,
    text: '¿Alcanza para pagar proveedores y nómina a tiempo este mes?',
    category: 'cashflow',
    options: [
      { label: 'Sí, alcanza', value: 'Sí', points: 10 },
      { label: 'No, está difícil', value: 'No', points: 0 },
    ],
  },
  {
    id: 3,
    text: '¿Cuántos clientes nuevos conseguiste el mes pasado?',
    category: 'sales',
    options: [
      { label: 'Ninguno', value: '0', points: 0 },
      { label: '1 a 3 clientes', value: '1-3', points: 3 },
      { label: '4 a 10 clientes', value: '4-10', points: 7 },
      { label: 'Más de 10', value: 'más de 10', points: 9 },
    ],
  },
  {
    id: 4,
    text: '¿Tus ventas este mes son mayores que el mes pasado?',
    category: 'sales',
    options: [
      { label: 'Sí, crecieron', value: 'Sí', points: 10 },
      { label: 'Más o menos igual', value: 'Más o menos', points: 5 },
      { label: 'No, bajaron', value: 'No', points: 0 },
    ],
  },
  {
    id: 5,
    text: '¿Sabes cuál es tu producto o servicio más rentable?',
    category: 'management',
    options: [
      { label: 'Sí, lo sé', value: 'Sí', points: 7 },
      { label: 'No estoy seguro', value: 'No', points: 0 },
    ],
  },
  {
    id: 6,
    text: '¿Tienes deudas vencidas con proveedores o bancos?',
    category: 'cashflow',
    options: [
      { label: 'Sí, tengo deudas vencidas', value: 'Sí', points: 0 },
      { label: 'No, estoy al día', value: 'No', points: 10 },
    ],
  },
  {
    id: 7,
    text: '¿Llevas algún registro de tus ingresos y gastos?',
    category: 'management',
    options: [
      { label: 'Sí, en app o computador', value: 'Sí, digital', points: 8 },
      { label: 'Sí, en cuaderno o libreta', value: 'Sí, en papel', points: 4 },
      { label: 'No llevo registros', value: 'No', points: 0 },
    ],
  },
  {
    id: 8,
    text: '¿Cuántos meses podría sobrevivir tu negocio sin ventas nuevas?',
    category: 'cashflow',
    options: [
      { label: 'Menos de un mes', value: '0', points: 0 },
      { label: '1 a 2 meses', value: '1-2', points: 3 },
      { label: '3 a 6 meses', value: '3-6', points: 7 },
      { label: 'Más de 6 meses', value: 'más de 6', points: 10 },
    ],
  },
  {
    id: 9,
    text: '¿Tienes al menos 3 clientes que compran regularmente?',
    category: 'sales',
    options: [
      { label: 'Sí, los tengo', value: 'Sí', points: 8 },
      { label: 'No, aún no', value: 'No', points: 0 },
    ],
  },
  {
    id: 10,
    text: '¿Subiste precios en el último año?',
    category: 'sales',
    options: [
      { label: 'Sí, los ajusté', value: 'Sí', points: 8 },
      { label: 'No los subí', value: 'No', points: 0 },
      { label: 'No sé si debo', value: 'No sé si debo', points: 0 },
    ],
  },
  {
    id: 11,
    text: '¿Sabes cuánto te cuesta producir o prestar cada producto/servicio?',
    category: 'management',
    options: [
      { label: 'Sí, lo calculo', value: 'Sí', points: 5 },
      { label: 'No, no lo sé bien', value: 'No', points: 0 },
    ],
  },
  {
    id: 12,
    text: '¿Tienes algún ahorro o reserva para emergencias del negocio?',
    category: 'management',
    options: [
      { label: 'Sí, tengo reserva', value: 'Sí', points: 5 },
      { label: 'Poco o casi nada', value: 'Poco', points: 3 },
      { label: 'No tengo nada', value: 'No', points: 0 },
    ],
  },
];

// Max scores by category for reference
// cashflow  (Q1,Q2,Q6,Q8): 10+10+10+10 = 40
// sales     (Q3,Q4,Q9,Q10): 9+10+8+8   = 35
// management(Q5,Q7,Q11,Q12): 7+8+5+5   = 25
// TOTAL                                  = 100
