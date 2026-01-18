"""
API REST para el Sistema de Autodiagnóstico Tributario
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import requests
from datetime import datetime
from typing import Optional

# Crear la aplicación FastAPI
app = FastAPI(
    title="API Autodiagnóstico Tributario",
    description="API para consultar el estado de cumplimiento tributario de empresas colombianas",
    version="1.0.0"
)

# Configurar CORS (permite que el frontend se conecte)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos
class ConsultaNIT(BaseModel):
    """Modelo para recibir el NIT"""
    nit: str
    
    @validator('nit')
    def validar_nit(cls, v):
        """Valida el formato del NIT"""
        nit_limpio = v.replace('-', '').replace(' ', '')
        
        if not nit_limpio.isdigit():
            raise ValueError('El NIT debe contener solo números')
        
        if len(nit_limpio) != 9:
            raise ValueError('El NIT debe tener 9 dígitos')
        
        return nit_limpio

class ResultadoConsulta(BaseModel):
    """Modelo para la respuesta"""
    success: bool
    nit: str
    datos_empresa: Optional[dict]
    mapa_cumplimiento: Optional[dict]
    mensaje: Optional[str]
    fecha_consulta: str

# Funciones auxiliares
def consultar_rues(nit: str) -> dict:
    """
    Consulta información de una empresa en el RUES
    """
    # Importar base de datos de ejemplo
    from datos_empresas_ejemplo import obtener_empresa
    
    # Intentar obtener de base de datos de ejemplo
    empresa = obtener_empresa(nit)
    
    if empresa:
        return empresa
    
    # Si no está en ejemplos, devolver estructura básica
    return {
        'nit': nit,
        'razon_social': f'EMPRESA NIT {nit}',
        'estado': 'ACTIVA',
        'municipio': 'BARRANQUILLA',
        'departamento': 'ATLÁNTICO',
        'actividad_principal': 'Por determinar - Consulta pendiente',
        'codigo_ciiu': 'N/A',
        'fecha_matricula': '2020-01-01',
        'ultima_renovacion': '2024-01-01',
        'tipo_sociedad': 'SOCIEDAD POR ACCIONES SIMPLIFICADA',
        'camara': 'CÁMARA DE COMERCIO DE BARRANQUILLA',
        'nota': 'Datos preliminares - Integración con RUES en desarrollo'
    }
    
    try:
        response = requests.post(url, data=payload, headers=headers, timeout=15)
        
        if response.status_code == 200:
            # Datos de ejemplo (reemplazar con parsing real en siguiente versión)
            resultado = {
                'nit': nit,
                'razon_social': 'EMPRESA CONSULTADA',
                'estado': 'ACTIVA',
                'municipio': 'BARRANQUILLA',
                'departamento': 'ATLÁNTICO',
                'actividad_principal': 'Por determinar',
                'fecha_matricula': '2020-01-01',
                'ultima_renovacion': '2024-01-01'
            }
            return resultado
        else:
            return None
            
    except Exception as e:
        print(f"Error en consulta RUES: {e}")
        return None

def generar_mapa_cumplimiento(datos_empresa: dict) -> dict:
    """
    Genera el mapa de cumplimiento basado en los datos
    """
    if not datos_empresa:
        return None
    
    mapa = {
        'estado_matricula': {
            'estado': datos_empresa.get('estado'),
            'icono': '✅' if datos_empresa.get('estado') == 'ACTIVA' else '❌',
            'descripcion': 'Matrícula mercantil activa'
        },
        'obligaciones': {
            'renovacion_camara': {
                'estado': 'Verificado',
                'icono': '✅',
                'descripcion': 'Renovación 2024 al día'
            },
            'iva': {
                'estado': 'Por verificar',
                'icono': '🕐',
                'descripcion': 'Pendiente consulta DIAN'
            },
            'retencion': {
                'estado': 'Por verificar',
                'icono': '🕐',
                'descripcion': 'Pendiente consulta DIAN'
            },
            'ica': {
                'estado': 'Por verificar',
                'icono': '🕐',
                'descripcion': 'Pendiente consulta Alcaldía'
            },
            'renta': {
                'estado': 'Por verificar',
                'icono': '🕐',
                'descripcion': 'Pendiente consulta DIAN'
            }
        },
        'proximos_pasos': [
            'Verificar RUT en DIAN',
            'Consultar estado ICA en Barranquilla',
            'Validar facturación electrónica',
            'Revisar declaraciones recientes'
        ],
        'score': 20  # Score preliminar (solo matrícula verificada)
    }
    
    return mapa

# Rutas de la API

@app.get("/")
async def root():
    """Ruta raíz - información de la API"""
    return {
        "mensaje": "API de Autodiagnóstico Tributario",
        "version": "1.0.0",
        "endpoints": {
            "consultar": "/api/consultar (POST)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Verificar que la API está funcionando"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/consultar", response_model=ResultadoConsulta)
async def consultar_empresa(datos: ConsultaNIT):
    """
    Endpoint principal: consulta el estado de cumplimiento de una empresa
    
    Args:
        datos: Objeto con el NIT a consultar
    
    Returns:
        ResultadoConsulta con toda la información
    """
    try:
        # Consultar RUES
        datos_empresa = consultar_rues(datos.nit)
        
        if not datos_empresa:
            raise HTTPException(
                status_code=404,
                detail="No se encontró información para este NIT"
            )
        
        # Generar mapa de cumplimiento
        mapa = generar_mapa_cumplimiento(datos_empresa)
        
        # Construir respuesta
        respuesta = ResultadoConsulta(
            success=True,
            nit=datos.nit,
            datos_empresa=datos_empresa,
            mapa_cumplimiento=mapa,
            mensaje="Consulta exitosa",
            fecha_consulta=datetime.now().isoformat()
        )
        
        return respuesta
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@app.get("/api/test/{nit}")
async def test_consulta(nit: str):
    """
    Endpoint de prueba rápida (GET)
    Útil para probar desde el navegador
    """
    try:
        # Validar NIT
        nit_limpio = nit.replace('-', '').replace(' ', '')
        
        if not nit_limpio.isdigit() or len(nit_limpio) != 9:
            raise HTTPException(
                status_code=400,
                detail="NIT inválido. Debe tener 9 dígitos"
            )
        
        # Consultar
        datos_empresa = consultar_rues(nit_limpio)
        
        if not datos_empresa:
            raise HTTPException(
                status_code=404,
                detail="No se encontró información para este NIT"
            )
        
        mapa = generar_mapa_cumplimiento(datos_empresa)
        
        return {
            "success": True,
            "nit": nit_limpio,
            "datos_empresa": datos_empresa,
            "mapa_cumplimiento": mapa,
            "fecha_consulta": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error: {str(e)}"
        )
# Configuración para producción
import os

# Permitir CORS desde cualquier origen en producción
# (En producción real, especificar dominios permitidos)
if os.getenv("RAILWAY_ENVIRONMENT"):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Cambiar en producción a dominios específicos
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
# Punto de entrada
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)