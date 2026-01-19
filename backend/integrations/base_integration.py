"""
Clase base para todas las integraciones
"""

from abc import ABC, abstractmethod
from typing import Optional, Dict


class BaseIntegration(ABC):
    """
    Interfaz común para todas las integraciones externas
    """
    
    @property
    @abstractmethod
    def nombre(self) -> str:
        """Nombre de la integración"""
        pass
    
    @property
    @abstractmethod
    def disponible(self) -> bool:
        """Indica si la integración está disponible"""
        pass
    
    @abstractmethod
    async def consultar(self, nit: str) -> Optional[Dict]:
        """
        Consulta información de una empresa
        
        Args:
            nit: NIT de la empresa
            
        Returns:
            Diccionario con datos o None si no está disponible
        """
        pass
    
    def datos_simulados(self, nit: str) -> Optional[Dict]:
        """
        Retorna datos simulados cuando la integración no está disponible
        
        Args:
            nit: NIT de la empresa
            
        Returns:
            Diccionario con datos de ejemplo o None
        """
        return None
    
    async def consultar_con_fallback(self, nit: str) -> Optional[Dict]:
        """
        Intenta consultar, si falla usa datos simulados
        """
        if self.disponible:
            try:
                return await self.consultar(nit)
            except Exception as e:
                print(f"Error en {self.nombre}: {e}")
        
        return self.datos_simulados(nit)