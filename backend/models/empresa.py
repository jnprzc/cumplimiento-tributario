"""
Modelos de datos para empresas
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class DatosBasicos(BaseModel):
    """Información básica de la empresa"""
    nit: str
    razon_social: str
    estado: str
    municipio: str
    departamento: str
    actividad_principal: str
    codigo_ciiu: Optional[str] = None


class DatosRegistrales(BaseModel):
    """Datos de matrícula y registro"""
    fecha_matricula: str
    ultima_renovacion: str
    tipo_sociedad: str
    camara: str
    estado_renovacion_2024: Optional[str] = None


class DatosOperacionales(BaseModel):
    """Datos operacionales de la empresa"""
    tamano: Optional[str] = None
    empleados_rango: Optional[str] = None
    responsabilidades_tributarias: List[str] = []


class SeñalesAduana(BaseModel):
    """Señales de actividad aduanera (futuro)"""
    tiene_registro: bool = False
    tipo: Optional[str] = None  # 'importador', 'exportador', 'ambos'
    ultima_operacion: Optional[str] = None
    activo: bool = False


class MetadataFuentes(BaseModel):
    """Metadata sobre las fuentes de datos"""
    fuentes_verificadas: List[str] = []
    ultima_actualizacion: str = Field(default_factory=lambda: datetime.now().isoformat())
    version_datos: str = "1.0"


class ScoreCompliance(BaseModel):
    """Score de cumplimiento"""
    score: int
    nivel: str  # 'Básico', 'Confiable', 'Premium'
    señales_activas: List[str] = []
    detalles: Dict = {}


class EmpresaCompleta(BaseModel):
    """
    Modelo completo de una empresa
    Unifica todos los datos disponibles
    """
    # Datos básicos
    datos_basicos: DatosBasicos
    
    # Datos registrales
    datos_registrales: DatosRegistrales
    
    # Datos operacionales
    datos_operacionales: DatosOperacionales
    
    # Señales aduaneras (futuro)
    señales_aduana: Optional[SeñalesAduana] = None
    
    # Metadata
    metadata: MetadataFuentes
    
    # Score
    score_compliance: Optional[ScoreCompliance] = None
    
    @classmethod
    def desde_datos_ejemplo(cls, datos_dict: dict):
        """
        Convierte datos del formato actual a EmpresaCompleta
        """
        return cls(
            datos_basicos=DatosBasicos(
                nit=datos_dict['nit'],
                razon_social=datos_dict['razon_social'],
                estado=datos_dict['estado'],
                municipio=datos_dict['municipio'],
                departamento=datos_dict['departamento'],
                actividad_principal=datos_dict['actividad_principal'],
                codigo_ciiu=datos_dict.get('codigo_ciiu')
            ),
            datos_registrales=DatosRegistrales(
                fecha_matricula=datos_dict['fecha_matricula'],
                ultima_renovacion=datos_dict['ultima_renovacion'],
                tipo_sociedad=datos_dict['tipo_sociedad'],
                camara=datos_dict['camara'],
                estado_renovacion_2024=datos_dict.get('estado_renovacion_2024')
            ),
            datos_operacionales=DatosOperacionales(
                tamano=datos_dict.get('tamano'),
                empleados_rango=datos_dict.get('empleados_rango'),
                responsabilidades_tributarias=datos_dict.get('responsabilidades_tributarias', [])
            ),
            metadata=MetadataFuentes(
                fuentes_verificadas=['datos_ejemplo'],
                version_datos='1.0'
            )
        )
    
    def a_dict_simple(self) -> dict:
        """
        Convierte a formato compatible con API actual
        """
        resultado = {
            **self.datos_basicos.dict(),
            **self.datos_registrales.dict(),
            **self.datos_operacionales.dict()
        }
        
        if self.señales_aduana:
            resultado['operaciones_aduana'] = self.señales_aduana.dict()
        
        return resultado