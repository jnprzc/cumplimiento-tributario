"""
Servicio de verificación de empresas
Orquesta múltiples fuentes de datos
"""

from typing import Optional, Dict, List
from integrations.datos_ejemplo_integration import DatosEjemploIntegration
from integrations.aduana_integration import AduanaIntegration
from models.empresa import EmpresaCompleta


class VerificacionService:
    """
    Orquestador de fuentes de verificación
    Intenta múltiples fuentes en cascada
    """
    
    def __init__(self):
        # Fuentes disponibles ordenadas por prioridad
        self.fuentes = [
            DatosEjemploIntegration(),
            # Futuro: RUESIntegration(),
            # Futuro: DIANIntegration(),
            # Futuro: ICAIntegration(),
        ]
        
        # Fuentes complementarias (no bloquean consulta)
        self.fuentes_complementarias = [
            AduanaIntegration()
        ]
    
    async def verificar_empresa(self, nit: str) -> Optional[EmpresaCompleta]:
        """
        Verifica empresa intentando múltiples fuentes
        
        Args:
            nit: NIT de la empresa
            
        Returns:
            EmpresaCompleta o None si no se encuentra
        """
        # 1. Obtener datos básicos (fuentes principales)
        datos_basicos = await self._obtener_datos_basicos(nit)
        
        if not datos_basicos:
            return None
        
        # 2. Convertir a modelo EmpresaCompleta
        empresa = EmpresaCompleta.desde_datos_ejemplo(datos_basicos)
        
        # 3. Enriquecer con fuentes complementarias
        await self._enriquecer_con_complementarias(empresa, nit)
        
        return empresa
    
    async def _obtener_datos_basicos(self, nit: str) -> Optional[Dict]:
        """
        Intenta obtener datos básicos de fuentes principales
        """
        for fuente in self.fuentes:
            try:
                datos = await fuente.consultar_con_fallback(nit)
                if datos:
                    return datos
            except Exception as e:
                print(f"Error consultando {fuente.nombre}: {e}")
                continue
        
        return None
    
    async def _enriquecer_con_complementarias(self, empresa: EmpresaCompleta, nit: str):
        """
        Enriquece empresa con datos complementarios
        (No bloquea si fallan)
        """
        for fuente in self.fuentes_complementarias:
            try:
                if fuente.nombre == "ADUANA":
                    datos_aduana = await fuente.consultar_con_fallback(nit)
                    if datos_aduana and datos_aduana.get('tiene_registro'):
                        from backend.models.empresa import SeñalesAduana
                        empresa.señales_aduana = SeñalesAduana(**datos_aduana)
                        
                        # Actualizar fuentes verificadas
                        if empresa.señales_aduana.activo:
                            empresa.metadata.fuentes_verificadas.append('aduana_simulado')
                
            except Exception as e:
                print(f"Error enriqueciendo con {fuente.nombre}: {e}")
                # No falla la consulta completa
                continue
    
    def obtener_estado_fuentes(self) -> List[Dict]:
        """
        Retorna estado de todas las fuentes
        Útil para debugging y monitoreo
        """
        estado = []
        
        for fuente in self.fuentes + self.fuentes_complementarias:
            estado.append({
                'nombre': fuente.nombre,
                'disponible': fuente.disponible,
                'tipo': 'principal' if fuente in self.fuentes else 'complementaria'
            })
        
        return estado