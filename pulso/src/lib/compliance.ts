import type { Company, Signal, DiagnosisResult, ComplianceLevel } from '@/types';

function renovacionVigente(ultimaRenovacion: string): boolean {
  const fecha = new Date(ultimaRenovacion);
  const hace12Meses = new Date();
  hace12Meses.setFullYear(hace12Meses.getFullYear() - 1);
  return fecha >= hace12Meses;
}

function scorePorTamano(tamano: string): number {
  const tabla: Record<string, number> = {
    GRANDE: 20,
    MEDIANA: 15,
    'PEQUEÑA': 10,
    MICROEMPRESA: 5,
  };
  return tabla[tamano] ?? 5;
}

function clasificarNivel(score: number): ComplianceLevel {
  if (score >= 80) return 'Premium';
  if (score >= 50) return 'Confiable';
  return 'Básico';
}

function generarProximosPasos(senales: Signal[], nivel: ComplianceLevel): string[] {
  const pasos: string[] = [];

  for (const senal of senales.filter((s) => !s.activa).slice(0, 4)) {
    switch (senal.nombre) {
      case 'Matrícula Activa':
        pasos.push('Reactiva tu matrícula mercantil en la Cámara de Comercio.');
        break;
      case 'Renovación Vigente':
        pasos.push('Renueva tu matrícula mercantil antes del 31 de marzo del año vigente.');
        break;
      case 'RUT Verificado':
        pasos.push('Actualiza tus responsabilidades tributarias en el RUT ante la DIAN.');
        break;
      case 'ICA Vigente':
        pasos.push('Verifica el estado de tu ICA con la Secretaría de Hacienda municipal.');
        break;
      case 'Sin Sanciones':
        pasos.push('Consulta con un contador las sanciones pendientes y regulariza tu situación.');
        break;
      case 'Comercio Exterior':
        pasos.push('Si exportas o importas, regístrate como operador de comercio exterior ante la DIAN.');
        break;
    }
  }

  if (pasos.length === 0) {
    pasos.push('Mantén al día las renovaciones anuales antes del 31 de marzo.');
    if (nivel === 'Premium') {
      pasos.push('Considera obtener el certificado de cumplimiento tributario de la DIAN.');
    }
  }

  return pasos;
}

export function calcularScore(empresa: Company): DiagnosisResult {
  const senales: Signal[] = [];
  let totalScore = 0;

  // 1. Matrícula Activa — 20 pts
  const matriculaActiva = empresa.estado === 'ACTIVA';
  const ptsMatricula = matriculaActiva ? 20 : 0;
  totalScore += ptsMatricula;
  senales.push({
    nombre: 'Matrícula Activa',
    activa: matriculaActiva,
    puntos_maximos: 20,
    puntos_obtenidos: ptsMatricula,
    descripcion: matriculaActiva
      ? 'Empresa activa en cámara de comercio'
      : 'Matrícula inactiva o cancelada',
    icono: '🏢',
  });

  // 2. Renovación Vigente — 15 pts
  const renovVigente = renovacionVigente(empresa.ultima_renovacion);
  const ptsRenov = renovVigente ? 15 : 0;
  totalScore += ptsRenov;
  senales.push({
    nombre: 'Renovación Vigente',
    activa: renovVigente,
    puntos_maximos: 15,
    puntos_obtenidos: ptsRenov,
    descripcion: renovVigente
      ? 'Renovación al día (últimos 12 meses)'
      : 'Renovación vencida o pendiente',
    icono: '📅',
  });

  // 3. Tamaño Empresa — 5-20 pts
  const ptsTamano = scorePorTamano(empresa.tamano);
  totalScore += ptsTamano;
  senales.push({
    nombre: 'Tamaño Empresa',
    activa: true,
    puntos_maximos: 20,
    puntos_obtenidos: ptsTamano,
    descripcion: `${empresa.tamano.charAt(0) + empresa.tamano.slice(1).toLowerCase()} (${ptsTamano}/20 pts)`,
    icono: '📊',
  });

  // 4. RUT Verificado — 15 pts
  const rutVerificado = empresa.responsabilidades_tributarias.length > 0;
  const ptsRut = rutVerificado ? 15 : 0;
  totalScore += ptsRut;
  senales.push({
    nombre: 'RUT Verificado',
    activa: rutVerificado,
    puntos_maximos: 15,
    puntos_obtenidos: ptsRut,
    descripcion: rutVerificado
      ? `${empresa.responsabilidades_tributarias.length} responsabilidad${empresa.responsabilidades_tributarias.length > 1 ? 'es' : ''} declarada${empresa.responsabilidades_tributarias.length > 1 ? 's' : ''}`
      : 'Sin responsabilidades tributarias declaradas',
    icono: '📋',
  });

  // 5. ICA Vigente — 10 pts
  const icaVigente =
    empresa.estado === 'ACTIVA' &&
    empresa.responsabilidades_tributarias.some((r) =>
      r.toLowerCase().includes('ica'),
    );
  const ptsIca = icaVigente ? 10 : 0;
  totalScore += ptsIca;
  senales.push({
    nombre: 'ICA Vigente',
    activa: icaVigente,
    puntos_maximos: 10,
    puntos_obtenidos: ptsIca,
    descripcion: icaVigente
      ? 'Impuesto ICA municipal al día'
      : 'ICA no registrado o no aplica',
    icono: '🏛️',
  });

  // 6. Sin Sanciones — 10 pts
  const sinSanciones = empresa.estado === 'ACTIVA';
  const ptsSanciones = sinSanciones ? 10 : 0;
  totalScore += ptsSanciones;
  senales.push({
    nombre: 'Sin Sanciones',
    activa: sinSanciones,
    puntos_maximos: 10,
    puntos_obtenidos: ptsSanciones,
    descripcion: sinSanciones
      ? 'Sin sanciones tributarias registradas'
      : 'Posibles sanciones o irregularidades detectadas',
    icono: '✅',
  });

  // 7. Comercio Exterior — 10 pts
  const comercioActivo = empresa.tiene_comercio_exterior;
  const ptsComercio = comercioActivo ? 10 : 0;
  totalScore += ptsComercio;
  senales.push({
    nombre: 'Comercio Exterior',
    activa: comercioActivo,
    puntos_maximos: 10,
    puntos_obtenidos: ptsComercio,
    descripcion: comercioActivo
      ? `Operaciones de ${empresa.tipo_comercio ?? 'comercio exterior'} activas`
      : 'Sin operaciones de comercio exterior',
    icono: '🌍',
  });

  const nivel = clasificarNivel(totalScore);

  return {
    nit: empresa.nit,
    empresa,
    score: totalScore,
    nivel,
    senales,
    senales_activas: senales.filter((s) => s.activa).length,
    proximos_pasos: generarProximosPasos(senales, nivel),
  };
}
