"""
Integración con DIAN - Módulo Aduanas
Estado: PLACEHOLDER (Futuro)
"""

from typing import Optional, Dict
from integrations.base_integration import BaseIntegration


class AduanaIntegration(BaseIntegration):
    """
    Integración con sistema de aduanas
    
    Requiere: Convenio institucional con DIAN
    Estado: Diseñado pero no implementado
    """
    
    @property
    def nombre(self) -> str:
        return "ADUANA"
    
    @property
    def disponible(self) -> bool:
        return False  # TODO: Cambiar cuando esté disponible
    
    async def consultar(self, nit: str) -> Optional[Dict]:
        """
        Consulta registro de importador/exportador
        
        TODO: Implementar cuando tengamos acceso oficial
        """
        # Por ahora, usar datos simulados
        return self.datos_simulados(nit)
    
    def datos_simulados(self, nit: str) -> Optional[Dict]:
        """
        Datos simulados basados en tamaño de empresa
        Empresas grandes típicamente tienen actividad aduanera
        """
        # NITs de empresas grandes conocidas
        empresas_grandes = [
            '890903938',  # Bancolombia
            '860034313',  # Ecopetrol
            '890900608',  # Éxito
            '800197268',  # Avianca
        ]
        
        if nit in empresas_grandes:
            return {
                'tiene_registro': True,
                'tipo': 'importador',  # o 'exportador' o 'ambos'
                'ultima_operacion': '2025-12-15',
                'activo': True,
                'volumen_anual_usd': 1000000  # Simulado
            }
        
        # Empresas medianas: 30% tienen actividad
        if nit.startswith('900'):
            import random
            random.seed(int(nit))  # Consistente para mismo NIT
            if random.random() < 0.3:
                return {
                    'tiene_registro': True,
                    'tipo': 'importador',
                    'ultima_operacion': '2025-11-20',
                    'activo': True,
                    'volumen_anual_usd': 50000
                }
        
        # Por defecto: sin actividad aduanera
        return {
            'tiene_registro': False,
            'activo': False
        }