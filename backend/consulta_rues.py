"""
Script para consultar información básica de empresas en el RUES
"""

import requests
from datetime import datetime

def consultar_rues(nit):
    """
    Consulta información de una empresa en el RUES usando Apitude API
    
    Args:
        nit (str): NIT de la empresa (9 dígitos)
    
    Returns:
        dict: Información de la empresa o None si hay error
    """
    
    print(f"\n🔍 Consultando NIT: {nit}...")
    
    # URL de la API de Apitude (servicio gratuito para consultar RUES)
    url = f"https://api.apitude.co/v1/rues/{nit}"
    
    try:
        # Hacer la petición
        response = requests.get(url, timeout=10)
        
        # Verificar si la respuesta fue exitosa
        if response.status_code == 200:
            data = response.json()
            
            # Extraer información relevante
            if data and 'data' in data:
                empresa = data['data']
                
                resultado = {
                    'nit': nit,
                    'razon_social': empresa.get('razon_social', 'No disponible'),
                    'estado': empresa.get('estado', 'No disponible'),
                    'municipio': empresa.get('municipio', 'No disponible'),
                    'departamento': empresa.get('departamento', 'No disponible'),
                    'actividad_principal': empresa.get('actividad_principal', 'No disponible'),
                    'fecha_matricula': empresa.get('fecha_matricula', 'No disponible'),
                    'ultima_renovacion': empresa.get('ultima_renovacion', 'No disponible')
                }
                
                return resultado
            else:
                print("❌ No se encontró información para este NIT")
                return None
                
        else:
            print(f"❌ Error en la consulta. Código: {response.status_code}")
            return None
            
    except requests.exceptions.Timeout:
        print("❌ La consulta tardó demasiado. Intenta de nuevo.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Error de conexión: {e}")
        return None

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
    print("="*60 + "\n")

# Programa principal
if __name__ == "__main__":
    print("="*60)
    print("🏢 CONSULTA RUES - Prueba de Concepto")
    print("="*60)
    
    # NIT de prueba (Bancolombia - empresa pública conocida)
    nit_prueba = "890903938"
    
    # Realizar consulta
    resultado = consultar_rues(nit_prueba)
    
    # Mostrar resultado
    mostrar_resultado(resultado)
    
    print("✅ Script ejecutado correctamente")