"""
Integración con datos de ejemplo
(migración del datos_empresas_ejemplo.py actual)
"""

from typing import Optional, Dict
from integrations.base_integration import BaseIntegration
from datos_empresas_ejemplo import EMPRESAS_EJEMPLO


class DatosEjemploIntegration(BaseIntegration):
    """
    Integración que usa los datos de ejemplo actuales
    """
    
    @property
    def nombre(self) -> str:
        return "DATOS_EJEMPLO"
    
    @property
    def disponible(self) -> bool:
        return True  # Siempre disponible
    
    async def consultar(self, nit: str) -> Optional[Dict]:
        """
        Consulta empresa en base de datos de ejemplo
        """
        return EMPRESAS_EJEMPLO.get(nit, None)
    
    def datos_simulados(self, nit: str) -> Optional[Dict]:
        """
        Para NITs no conocidos, genera datos genéricos
        """
        return {
            'nit': nit,
            'razon_social': f'EMPRESA NIT {nit}',
            'estado': 'ACTIVA',
            'municipio': 'BARRANQUILLA',
            'departamento': 'ATLÁNTICO',
            'actividad_principal': 'Actividad económica por determinar',
            'codigo_ciiu': 'N/A',
            'fecha_matricula': '2020-01-01',
            'ultima_renovacion': '2024-01-01',
            'tipo_sociedad': 'SOCIEDAD POR ACCIONES SIMPLIFICADA',
            'camara': 'CÁMARA DE COMERCIO DE BARRANQUILLA',
            'tamano': 'PEQUEÑA',
            'empleados_rango': '10-50',
            'responsabilidades_tributarias': [
                'IVA - RÉGIMEN COMÚN',
                'RETENCIÓN EN LA FUENTE',
                'IMPUESTO DE RENTA'
            ],
            'nota': 'Datos preliminares - Integración pendiente'
        }