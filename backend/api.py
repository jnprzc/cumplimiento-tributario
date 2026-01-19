"""
API REST para Sistema de Autodiagnóstico Tributario
Versión 2.0 - Con arquitectura de services
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional

# Importar services
from services.verificacion_service import VerificacionService
from services.compliance_service import ComplianceService

# Crear aplicación
app = FastAPI(
    title="API de Autodiagnóstico Tributario",
    version="2.0.0",
    description="Sistema de verificación de cumplimiento tributario para empresas colombianas"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic para la API
class ConsultaNIT(BaseModel):
    """Modelo para consulta de NIT"""
    nit: str
    
    @validator('nit')
    def validar_nit(cls, v):
        # Limpiar formato
        nit_limpio = v.replace('-', '').replace('.', '').replace(' ', '')
        
        # Validar que solo contenga dígitos
        if not nit_limpio.isdigit():
            raise ValueError('El NIT debe contener solo números')
        
        # Validar longitud
        if len(nit_limpio) != 9:
            raise ValueError('El NIT debe tener 9 dígitos')
        
        return nit_limpio


class ResultadoConsulta(BaseModel):
    """Modelo para resultado de consulta"""
    success: bool
    nit: str
    datos_empresa: dict
    mapa_cumplimiento: dict
    fecha_consulta: str


# Endpoints

@app.get("/")
async def root():
    """Información de la API"""
    return {
        "mensaje": "API de Autodiagnóstico Tributario",
        "version": "2.0.0",
        "endpoints": {
            "consultar": "/api/consultar (POST)",
            "health": "/health (GET)",
            "docs": "/docs",
            "test": "/api/test/{nit} (GET)",
            "fuentes": "/api/fuentes (GET)"
        }
    }


@app.get("/health")
async def health():
    """Health check"""
    return {
        "status": "ok",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0"
    }


@app.get("/api/fuentes")
async def estado_fuentes():
    """
    Retorna el estado de todas las fuentes de datos
    Útil para monitoreo
    """
    verificacion_service = VerificacionService()
    fuentes = verificacion_service.obtener_estado_fuentes()
    
    return {
        "fuentes": fuentes,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/consultar", response_model=ResultadoConsulta)
async def consultar_empresa(consulta: ConsultaNIT):
    """
    Endpoint principal de consulta
    Consulta información completa de una empresa
    """
    try:
        # 1. Verificar empresa (orquesta múltiples fuentes)
        verificacion_service = VerificacionService()
        empresa = await verificacion_service.verificar_empresa(consulta.nit)
        
        if not empresa:
            raise HTTPException(
                status_code=404,
                detail=f"No se encontró información para el NIT {consulta.nit}"
            )
        
        # 2. Calcular score de compliance
        compliance_service = ComplianceService()
        score = compliance_service.calcular_score(empresa)
        
        # Agregar score a empresa
        empresa.score_compliance = score
        
        # 3. Generar mapa de cumplimiento
        mapa = compliance_service.generar_mapa_cumplimiento(empresa, score)
        
        # 4. Convertir a formato compatible con frontend actual
        datos_empresa = empresa.a_dict_simple()
        
        return ResultadoConsulta(
            success=True,
            nit=consulta.nit,
            datos_empresa=datos_empresa,
            mapa_cumplimiento=mapa,
            fecha_consulta=datetime.now().isoformat()
        )
        
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
    Endpoint de prueba rápida
    Permite probar desde el navegador
    """
    consulta = ConsultaNIT(nit=nit)
    return await consultar_empresa(consulta)


# Punto de entrada
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)