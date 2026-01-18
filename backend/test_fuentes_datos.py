"""
Script para probar diferentes fuentes de datos disponibles
"""

import requests
from bs4 import BeautifulSoup
import json

def test_apitude_rues(nit):
    """
    Probar API de Apitude (servicio de terceros para RUES)
    Gratis con límite de requests
    """
    print(f"\n{'='*60}")
    print("PROBANDO: Apitude API (RUES)")
    print(f"{'='*60}")
    
    url = f"https://api.apitude.co/v1/rues/{nit}"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Respuesta exitosa")
            print(f"\nDatos recibidos:")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            return data
        else:
            print(f"❌ Error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Excepción: {e}")
        return None

def test_rues_confecamaras(nit):
    """
    Probar consulta directa al RUES de Confecámaras
    Gratis pero requiere scraping
    """
    print(f"\n{'='*60}")
    print("PROBANDO: RUES Confecámaras (Scraping)")
    print(f"{'='*60}")
    
    url = "https://www.rues.org.co/RM/ConsultaNIT"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
    
    payload = {'nit': nit}
    
    try:
        response = requests.post(url, data=payload, headers=headers, timeout=15)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Conexión exitosa")
            print(f"Longitud respuesta: {len(response.text)} caracteres")
            
            # Intentar parsear HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Buscar información relevante
            # (La estructura exacta depende del HTML del RUES)
            print("\n📄 Estructura HTML recibida (primeros 500 chars):")
            print(response.text[:500])
            
            return response.text
        else:
            print(f"❌ Error: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Excepción: {e}")
        return None

def test_dian_rut(nit):
    """
    Probar consulta del RUT en DIAN
    Requiere interacción con formulario web
    """
    print(f"\n{'='*60}")
    print("PROBANDO: DIAN RUT")
    print(f"{'='*60}")
    
    # URL del servicio de consulta del RUT
    url = "https://muisca.dian.gov.co/WebRutMuisca/DefConsultaEstadoRUT.faces"
    
    print("⚠️  La DIAN requiere CAPTCHA y sesión")
    print("📌 Alternativas:")
    print("   1. Usar API de terceros (de pago)")
    print("   2. Implementar scraping con Selenium (complejo)")
    print("   3. Solicitar acceso a API oficial DIAN")
    
    return None

def test_datos_abiertos_colombia(nit):
    """
    Probar API de datos.gov.co
    Datasets públicos del gobierno
    """
    print(f"\n{'='*60}")
    print("PROBANDO: Datos Abiertos Colombia")
    print(f"{'='*60}")
    
    # URL base de la API CKAN
    base_url = "https://www.datos.gov.co/api/3/"
    
    print("✅ API disponible")
    print("📊 Datasets relevantes que podríamos usar:")
    print("   - Registro de empresas")
    print("   - Datos tributarios agregados")
    print("   - Información de cámaras de comercio")
    
    # Ejemplo: buscar datasets
    search_url = f"{base_url}action/package_search?q=empresas"
    
    try:
        response = requests.get(search_url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Encontrados {data.get('result', {}).get('count', 0)} datasets")
            return data
        else:
            print(f"❌ Error: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Excepción: {e}")
        return None

def resumen_fuentes():
    """
    Resumen de fuentes disponibles y recomendaciones
    """
    print(f"\n{'='*60}")
    print("📊 RESUMEN DE FUENTES DE DATOS")
    print(f"{'='*60}\n")
    
    fuentes = {
        "Apitude (RUES)": {
            "costo": "Gratis (límite de requests)",
            "dificultad": "⭐ Fácil",
            "datos": "Matrícula mercantil, actividad, ubicación",
            "recomendacion": "✅ USAR PARA MVP"
        },
        "RUES Confecámaras": {
            "costo": "Gratis",
            "dificultad": "⭐⭐⭐ Media (scraping)",
            "datos": "Información completa de matrícula",
            "recomendacion": "⚠️  Backup si Apitude falla"
        },
        "DIAN RUT": {
            "costo": "Gratis",
            "dificultad": "⭐⭐⭐⭐⭐ Difícil (CAPTCHA)",
            "datos": "Responsabilidades tributarias",
            "recomendacion": "🔄 Fase 2 con Selenium o API de pago"
        },
        "Datos.gov.co": {
            "costo": "Gratis",
            "dificultad": "⭐⭐ Fácil",
            "datos": "Datasets estadísticos",
            "recomendacion": "✅ Complementario"
        },
        "ICA Barranquilla": {
            "costo": "Depende de convenio",
            "dificultad": "⭐ Fácil (con convenio)",
            "datos": "Estado ICA, declaraciones",
            "recomendacion": "🎯 Para piloto con Alcaldía"
        }
    }
    
    for fuente, info in fuentes.items():
        print(f"\n🔹 {fuente}")
        for key, value in info.items():
            print(f"   {key.capitalize()}: {value}")

# Ejecutar pruebas
if __name__ == "__main__":
    print("="*60)
    print("🔬 PRUEBA DE FUENTES DE DATOS REALES")
    print("="*60)
    
    # NIT de prueba (Bancolombia)
    nit_prueba = "890903938"
    
    # Probar cada fuente
    print(f"\n🏢 Consultando NIT: {nit_prueba} (Bancolombia)")
    
    # 1. Apitude
    apitude_data = test_apitude_rues(nit_prueba)
    
    # 2. RUES Confecámaras
    rues_data = test_rues_confecamaras(nit_prueba)
    
    # 3. DIAN
    dian_data = test_dian_rut(nit_prueba)
    
    # 4. Datos abiertos
    datos_abiertos = test_datos_abiertos_colombia(nit_prueba)
    
    # Resumen
    resumen_fuentes()
    
    print(f"\n{'='*60}")
    print("✅ Pruebas completadas")
    print(f"{'='*60}\n")