"""
Script para consultar información básica de empresas en el RUES
Versión 2: Usando scraping directo del RUES
"""

import requests
import json

def consultar_rues_directo(nit):
    """
    Consulta información de una empresa directamente desde RUES Confecámaras
    
    Args:
        nit (str): NIT de la empresa (9 dígitos)
    
    Returns:
        dict: Información de la empresa o None si hay error
    """
    
    print(f"\n🔍 Consultando NIT: {nit}...")
    
    # URL del servicio RUES de Confecámaras
    url = "https://www.rues.org.co/RM/ConsultaNIT"
    
    # Datos para la consulta
    payload = {
        'nit': nit
    }
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    
    try:
        # Hacer la petición
        response = requests.post(url, data=payload, headers=headers, timeout=15)
        
        # Verificar respuesta
        if response.status_code == 200:
            print("✅ Conexión exitosa al RUES")
            
            # Por ahora, crear datos de ejemplo para probar el flujo
            # (En la próxima versión implementaremos el parsing real)
            resultado = {
                'nit': nit,
                'razon_social': 'EMPRESA CONSULTADA',
                'estado': 'ACTIVA',
                'municipio': 'BARRANQUILLA',
                'departamento': 'ATLÁNTICO',
                'actividad_principal': 'CONSULTANDO...',
                'fecha_matricula': '2020-01-01',
                'ultima_renovacion': '2024-01-01',
                'nota': 'Datos de ejemplo - Integración en desarrollo'
            }
            
            return resultado
        else:
            print(f"❌ Error en la consulta. Código: {response.status_code}")
            return None
            
    except requests.exceptions.Timeout:
        print("❌ La consulta tardó demasiado. Intenta de nuevo.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        return None

def validar_nit(nit):
    """
    Valida que el NIT tenga el formato correcto
    """
    # Remover guiones y espacios
    nit_limpio = nit.replace('-', '').replace(' ', '')
    
    # Verificar que solo tenga números
    if not nit_limpio.isdigit():
        return None
    
    # Verificar longitud (9 dígitos)
    if len(nit_limpio) != 9:
        return None
    
    return nit_limpio

def mostrar_resultado(resultado):
    """
    Muestra los resultados de forma organizada
    """
    if not resultado:
        return
    
    print("\n" + "="*60)
    print("📊 INFORMACIÓN DE LA EMPRESA")
    print("="*60)
    print(f"NIT:                  {resultado['nit']}")
    print(f"Razón Social:         {resultado['razon_social']}")
    print(f"Estado:               {resultado['estado']}")
    print(f"Ubicación:            {resultado['municipio']}, {resultado['departamento']}")
    print(f"Actividad Principal:  {resultado['actividad_principal']}")
    print(f"Fecha Matrícula:      {resultado['fecha_matricula']}")
    print(f"Última Renovación:    {resultado['ultima_renovacion']}")
    
    if 'nota' in resultado:
        print(f"\n⚠️  NOTA: {resultado['nota']}")
    
    print("="*60 + "\n")

# Programa principal
if __name__ == "__main__":
    print("="*60)
    print("🏢 CONSULTA RUES - Sistema de Autodiagnóstico Tributario")
    print("="*60)
    
    # Solicitar NIT al usuario
    print("\nIngresa el NIT de la empresa a consultar (9 dígitos):")
    print("Ejemplo: 890903938 (Bancolombia)")
    print("Ejemplo: 860034313 (Ecopetrol)")
    
    nit_input = input("\nNIT: ").strip()
    
    # Validar NIT
    nit_valido = validar_nit(nit_input)
    
    if not nit_valido:
        print("\n❌ NIT inválido. Debe tener 9 dígitos numéricos.")
    else:
        # Realizar consulta
        resultado = consultar_rues_directo(nit_valido)
        
        # Mostrar resultado
        mostrar_resultado(resultado)
    
    print("✅ Script ejecutado correctamente")