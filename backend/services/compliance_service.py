"""
Servicio de compliance y scoring
Genera el Corenta Score
"""

from typing import Dict, List
from models.empresa import EmpresaCompleta, ScoreCompliance, SeñalesAduana
from datetime import datetime, timedelta


class ComplianceService:
    """
    Motor de scoring y predicción de compliance
    """
    
    # Configuración de señales
    SEÑALES_CONFIG = {
        'matricula_activa': {
            'peso': 20,
            'descripcion': 'Matrícula mercantil activa',
            'fuente': 'rues'
        },
        'renovacion_vigente': {
            'peso': 15,
            'descripcion': 'Renovación al día (últimos 12 meses)',
            'fuente': 'rues'
        },
        'tamano_empresa': {
            'peso': 20,
            'descripcion': 'Tamaño y formalidad empresarial',
            'fuente': 'rues'
        },
        'rut_verificado': {
            'peso': 15,
            'descripcion': 'RUT verificado con responsabilidades',
            'fuente': 'dian'
        },
        'ica_vigente': {
            'peso': 10,
            'descripcion': 'ICA municipal al día',
            'fuente': 'alcaldia'
        },
        'sin_sanciones': {
            'peso': 10,
            'descripcion': 'Sin sanciones tributarias',
            'fuente': 'dian'
        },
        'comercio_exterior_activo': {
            'peso': 10,
            'descripcion': 'Operador de comercio exterior activo',
            'fuente': 'aduana'
        }
    }
    
    def calcular_score(self, empresa: EmpresaCompleta) -> ScoreCompliance:
        """
        Calcula el Corenta Score completo
        
        Args:
            empresa: Datos completos de la empresa
            
        Returns:
            ScoreCompliance con score y detalles
        """
        score = 0
        señales_activas = []
        detalles = {}
        
        # Señal 1: Matrícula activa
        if empresa.datos_basicos.estado == 'ACTIVA':
            score += self.SEÑALES_CONFIG['matricula_activa']['peso']
            señales_activas.append('matricula_activa')
            detalles['matricula'] = {
                'estado': 'ACTIVA',
                'puntos': self.SEÑALES_CONFIG['matricula_activa']['peso']
            }
        
        # Señal 2: Renovación vigente
        if self._renovacion_vigente(empresa):
            score += self.SEÑALES_CONFIG['renovacion_vigente']['peso']
            señales_activas.append('renovacion_vigente')
            detalles['renovacion'] = {
                'estado': 'AL DÍA',
                'fecha': empresa.datos_registrales.ultima_renovacion,
                'puntos': self.SEÑALES_CONFIG['renovacion_vigente']['peso']
            }
        
        # Señal 3: Tamaño empresa
        puntos_tamano = self._score_por_tamano(empresa)
        if puntos_tamano > 0:
            score += puntos_tamano
            señales_activas.append('tamano_empresa')
            detalles['tamano'] = {
                'clasificacion': empresa.datos_operacionales.tamano or 'No determinado',
                'puntos': puntos_tamano
            }
        
        # Señal 4: RUT verificado
        if empresa.datos_operacionales.responsabilidades_tributarias:
            score += self.SEÑALES_CONFIG['rut_verificado']['peso']
            señales_activas.append('rut_verificado')
            detalles['rut'] = {
                'estado': 'VERIFICADO',
                'responsabilidades': len(empresa.datos_operacionales.responsabilidades_tributarias),
                'puntos': self.SEÑALES_CONFIG['rut_verificado']['peso']
            }
        
        # Señal 7: Comercio exterior (NUEVA)
        if empresa.señales_aduana and empresa.señales_aduana.activo:
            score += self.SEÑALES_CONFIG['comercio_exterior_activo']['peso']
            señales_activas.append('comercio_exterior_activo')
            detalles['comercio_exterior'] = {
                'tipo': empresa.señales_aduana.tipo,
                'ultima_operacion': empresa.señales_aduana.ultima_operacion,
                'puntos': self.SEÑALES_CONFIG['comercio_exterior_activo']['peso']
            }
        
        # TODO: Implementar cuando tengamos las integraciones:
        # - Señal 5: ICA vigente
        # - Señal 6: Sin sanciones
        
        # Clasificar nivel
        nivel = self._clasificar_nivel(score)
        
        return ScoreCompliance(
            score=min(score, 100),
            nivel=nivel,
            señales_activas=señales_activas,
            detalles=detalles
        )
    
    def _renovacion_vigente(self, empresa: EmpresaCompleta) -> bool:
        """
        Verifica si la renovación está vigente (últimos 12 meses)
        """
        try:
            fecha_renovacion = datetime.fromisoformat(
                empresa.datos_registrales.ultima_renovacion
            )
            hace_un_ano = datetime.now() - timedelta(days=365)
            return fecha_renovacion >= hace_un_ano
        except:
            return False
    
    def _score_por_tamano(self, empresa: EmpresaCompleta) -> int:
        """
        Asigna puntos según tamaño de la empresa
        """
        tamano = empresa.datos_operacionales.tamano
        
        if not tamano:
            return 0
        
        tamano_upper = tamano.upper()
        
        if 'GRANDE' in tamano_upper:
            return 20
        elif 'MEDIANA' in tamano_upper:
            return 15
        elif 'PEQUEÑA' in tamano_upper or 'PEQUENA' in tamano_upper:
            return 10
        elif 'MICRO' in tamano_upper:
            return 5
        
        return 0
    
    def _clasificar_nivel(self, score: int) -> str:
        """
        Clasifica el nivel según el score
        """
        if score >= 80:
            return 'Premium'
        elif score >= 50:
            return 'Confiable'
        else:
            return 'Básico'
    
    def generar_mapa_cumplimiento(self, empresa: EmpresaCompleta, score: ScoreCompliance) -> Dict:
        """
        Genera el mapa de cumplimiento (formato actual de la API)
        Para mantener compatibilidad con frontend
        """
        return {
            'estado_matricula': {
                'estado': empresa.datos_basicos.estado,
                'icono': '✅' if empresa.datos_basicos.estado == 'ACTIVA' else '❌',
                'descripcion': f'Matrícula mercantil {empresa.datos_basicos.estado.lower()}'
            },
            'obligaciones': {
                'renovacion_camara': {
                    'estado': 'Renovada' if 'renovacion_vigente' in score.señales_activas else 'Por verificar',
                    'icono': '✅' if 'renovacion_vigente' in score.señales_activas else '🕐',
                    'descripcion': f"Renovación {empresa.datos_registrales.ultima_renovacion}"
                },
                'iva': {
                    'estado': 'Verificado' if 'rut_verificado' in score.señales_activas else 'Por verificar en DIAN',
                    'icono': '✅' if 'rut_verificado' in score.señales_activas else '🕐',
                    'descripcion': 'Pendiente consulta DIAN'
                },
                'retencion': {
                    'estado': 'Por verificar en DIAN',
                    'icono': '🕐',
                    'descripcion': 'Pendiente consulta DIAN'
                },
                'ica': {
                    'estado': 'Por verificar con Alcaldía',
                    'icono': '🕐',
                    'descripcion': f"Consulta Alcaldía de {empresa.datos_basicos.municipio}"
                },
                'renta': {
                    'estado': 'Por verificar en DIAN',
                    'icono': '🕐',
                    'descripcion': 'Pendiente consulta DIAN'
                }
            },
            'proximos_pasos': self._generar_proximos_pasos(empresa, score),
            'score': score.score,
            'nivel': score.nivel,
            'fecha_consulta': datetime.now().isoformat()
        }
    
    def _generar_proximos_pasos(self, empresa: EmpresaCompleta, score: ScoreCompliance) -> List[str]:
        """
        Genera recomendaciones personalizadas
        """
        pasos = []
        
        # Si no tiene RUT verificado
        if 'rut_verificado' not in score.señales_activas:
            pasos.append('Verificar RUT en DIAN')
        
        # Si tiene comercio exterior, priorizar actualización
        if empresa.señales_aduana and empresa.señales_aduana.activo:
            pasos.append('Validar actividad de comercio exterior en RUT')
        
        # Siempre incluir
        pasos.append(f'Consultar estado ICA en {empresa.datos_basicos.municipio}')
        pasos.append('Validar facturación electrónica')
        pasos.append('Revisar declaraciones recientes')
        
        return pasos[:4]  # Máximo 4 pasos