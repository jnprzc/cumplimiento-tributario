"""
Base de datos de ejemplo con empresas reales colombianas
Para usar mientras se integran las APIs oficiales
"""

EMPRESAS_EJEMPLO = {
    "890903938": {
        "nit": "890903938",
        "razon_social": "BANCOLOMBIA S.A.",
        "estado": "ACTIVA",
        "municipio": "MEDELLÍN",
        "departamento": "ANTIOQUIA",
        "actividad_principal": "Intermediación monetaria realizada por bancos comerciales",
        "codigo_ciiu": "6419",
        "fecha_matricula": "1998-01-15",
        "ultima_renovacion": "2025-03-20",
        "tipo_sociedad": "SOCIEDAD ANÓNIMA",
        "camara": "CÁMARA DE COMERCIO DE MEDELLÍN",
        "tamano": "GRANDE",
        "empleados_rango": "10000+",
        "estado_renovacion_2024": "RENOVADA",
        "responsabilidades_tributarias": [
            "IVA - RÉGIMEN COMÚN",
            "RETENCIÓN EN LA FUENTE",
            "IMPUESTO DE RENTA",
            "GRAN CONTRIBUYENTE"
        ]
    },
    "860034313": {
        "nit": "860034313",
        "razon_social": "ECOPETROL S.A.",
        "estado": "ACTIVA",
        "municipio": "BOGOTÁ D.C.",
        "departamento": "BOGOTÁ D.C.",
        "actividad_principal": "Extracción de petróleo crudo",
        "codigo_ciiu": "0610",
        "fecha_matricula": "2003-08-14",
        "ultima_renovacion": "2025-02-15",
        "tipo_sociedad": "SOCIEDAD ANÓNIMA",
        "camara": "CÁMARA DE COMERCIO DE BOGOTÁ",
        "tamano": "GRANDE",
        "empleados_rango": "10000+",
        "estado_renovacion_2024": "RENOVADA",
        "responsabilidades_tributarias": [
            "IVA - RÉGIMEN COMÚN",
            "RETENCIÓN EN LA FUENTE",
            "IMPUESTO DE RENTA",
            "GRAN CONTRIBUYENTE",
            "AUTORRETENEDOR"
        ]
    },
    "890900608": {
        "nit": "890900608",
        "razon_social": "ALMACENES ÉXITO S.A.",
        "estado": "ACTIVA",
        "municipio": "ENVIGADO",
        "departamento": "ANTIOQUIA",
        "actividad_principal": "Comercio al por menor en establecimientos no especializados",
        "codigo_ciiu": "4711",
        "fecha_matricula": "1950-03-24",
        "ultima_renovacion": "2025-03-10",
        "tipo_sociedad": "SOCIEDAD ANÓNIMA",
        "camara": "CÁMARA DE COMERCIO DE MEDELLÍN",
        "tamano": "GRANDE",
        "empleados_rango": "5000-10000",
        "estado_renovacion_2024": "RENOVADA",
        "responsabilidades_tributarias": [
            "IVA - RÉGIMEN COMÚN",
            "RETENCIÓN EN LA FUENTE",
            "IMPUESTO DE RENTA",
            "GRAN CONTRIBUYENTE"
        ]
    },
    "800197268": {
        "nit": "800197268",
        "razon_social": "AVIANCA S.A.",
        "estado": "ACTIVA",
        "municipio": "BOGOTÁ D.C.",
        "departamento": "BOGOTÁ D.C.",
        "actividad_principal": "Transporte aéreo nacional de pasajeros",
        "codigo_ciiu": "5111",
        "fecha_matricula": "1940-06-14",
        "ultima_renovacion": "2025-01-20",
        "tipo_sociedad": "SOCIEDAD ANÓNIMA",
        "camara": "CÁMARA DE COMERCIO DE BOGOTÁ",
        "tamano": "GRANDE",
        "empleados_rango": "5000-10000",
        "estado_renovacion_2024": "RENOVADA",
        "responsabilidades_tributarias": [
            "IVA - RÉGIMEN COMÚN",
            "RETENCIÓN EN LA FUENTE",
            "IMPUESTO DE RENTA"
        ]
    },
    "900123456": {
        "nit": "900123456",
        "razon_social": "EMPRESA EJEMPLO PYME SAS",
        "estado": "ACTIVA",
        "municipio": "BARRANQUILLA",
        "departamento": "ATLÁNTICO",
        "actividad_principal": "Actividades de consultoría de gestión",
        "codigo_ciiu": "7020",
        "fecha_matricula": "2020-01-15",
        "ultima_renovacion": "2024-12-20",
        "tipo_sociedad": "SOCIEDAD POR ACCIONES SIMPLIFICADA",
        "camara": "CÁMARA DE COMERCIO DE BARRANQUILLA",
        "tamano": "PEQUEÑA",
        "empleados_rango": "10-50",
        "estado_renovacion_2024": "RENOVADA",
        "responsabilidades_tributarias": [
            "IVA - RÉGIMEN COMÚN",
            "RETENCIÓN EN LA FUENTE",
            "IMPUESTO DE RENTA"
        ]
    },
    "900234567": {
        "nit": "900234567",
        "razon_social": "STARTUP TECH SOLUTIONS SAS",
        "estado": "ACTIVA",
        "municipio": "BARRANQUILLA",
        "departamento": "ATLÁNTICO",
        "actividad_principal": "Desarrollo de sistemas informáticos",
        "codigo_ciiu": "6201",
        "fecha_matricula": "2023-06-10",
        "ultima_renovacion": "2024-11-15",
        "tipo_sociedad": "SOCIEDAD POR ACCIONES SIMPLIFICADA",
        "camara": "CÁMARA DE COMERCIO DE BARRANQUILLA",
        "tamano": "MICROEMPRESA",
        "empleados_rango": "1-10",
        "estado_renovacion_2024": "RENOVADA",
        "responsabilidades_tributarias": [
            "IVA - RÉGIMEN COMÚN",
            "RETENCIÓN EN LA FUENTE",
            "IMPUESTO DE RENTA"
        ]
    },
    "900111111": {
        "nit": "900111111",
        "razon_social": "COMERCIALIZADORA CARIBE SAS",
        "estado": "ACTIVA",
        "municipio": "BARRANQUILLA",
        "departamento": "ATLÁNTICO",
        "actividad_principal": "Comercio al por mayor de alimentos",
        "codigo_ciiu": "4631",
        "fecha_matricula": "2019-03-20",
        "ultima_renovacion": "2024-10-05",
        "tipo_sociedad": "SOCIEDAD POR ACCIONES SIMPLIFICADA",
        "camara": "CÁMARA DE COMERCIO DE BARRANQUILLA",
        "tamano": "MEDIANA",
        "empleados_rango": "50-200",
        "estado_renovacion_2024": "RENOVADA",
        "responsabilidades_tributarias": [
            "IVA - RÉGIMEN COMÚN",
            "RETENCIÓN EN LA FUENTE",
            "IMPUESTO DE RENTA",
            "ICA - BARRANQUILLA"
        ]
    }
}

def obtener_empresa(nit):
    """
    Obtiene información de una empresa por NIT
    
    Args:
        nit (str): NIT de la empresa
        
    Returns:
        dict: Datos de la empresa o None si no existe
    """
    return EMPRESAS_EJEMPLO.get(nit, None)

def listar_nits_disponibles():
    """
    Retorna lista de NITs de ejemplo disponibles
    """
    return list(EMPRESAS_EJEMPLO.keys())

def buscar_por_municipio(municipio):
    """
    Busca empresas por municipio
    """
    resultado = []
    for nit, datos in EMPRESAS_EJEMPLO.items():
        if datos['municipio'].upper() == municipio.upper():
            resultado.append(datos)
    return resultado