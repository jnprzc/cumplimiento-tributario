export type CompanySize = 'GRANDE' | 'MEDIANA' | 'PEQUEÑA' | 'MICROEMPRESA';
export type CompanyStatus = 'ACTIVA' | 'INACTIVA' | 'CANCELADA';
export type ComplianceLevel = 'Premium' | 'Confiable' | 'Básico';

export interface Company {
  nit: string;
  razon_social: string;
  estado: CompanyStatus;
  municipio: string;
  departamento: string;
  actividad_principal: string;
  codigo_ciiu: string;
  fecha_matricula: string;
  ultima_renovacion: string;
  tipo_sociedad: string;
  camara: string;
  estado_renovacion_2024: string;
  tamano: CompanySize;
  empleados_rango: string;
  responsabilidades_tributarias: string[];
  tiene_comercio_exterior: boolean;
  tipo_comercio?: string;
}

export interface Signal {
  nombre: string;
  activa: boolean;
  puntos_maximos: number;
  puntos_obtenidos: number;
  descripcion: string;
  icono: string;
}

export interface DiagnosisResult {
  nit: string;
  empresa: Company;
  score: number;
  nivel: ComplianceLevel;
  senales: Signal[];
  senales_activas: number;
  proximos_pasos: string[];
}
