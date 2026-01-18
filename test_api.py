"""
Script para probar la API desde Python
"""

import requests
import json

# URL de la API
API_URL = "http://localhost:8000"

def probar_health():
    """Prueba el endpoint de health"""
    print("\n🔍 Probando endpoint /health...")
    
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Respuesta: {json.dumps(response.json(), indent=2)}")

def probar_consulta(nit):
    """Prueba la consulta de un NIT"""
    print(f"\n🔍 Consultando NIT: {nit}...")
    
    payload = {"nit": nit}
    response = requests.post(f"{API_URL}/api/consultar", json=payload)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ CONSULTA EXITOSA")
        print(f"Empresa: {data['datos_empresa']['razon_social']}")
        print(f"Estado: {data['datos_empresa']['estado']}")
        print(f"Score: {data['mapa_cumplimiento']['score']}/100")
        print(f"\nPróximos pasos:")
        for i, paso in enumerate(data['mapa_cumplimiento']['proximos_pasos'], 1):
            print(f"  {i}. {paso}")
    else:
        print(f"❌ Error: {response.json()}")

if __name__ == "__main__":
    print("="*60)
    print("🧪 PRUEBAS DE LA API")
    print("="*60)
    
    # Probar health
    probar_health()
    
    # Probar consultas
    nits_prueba = ["890903938", "860034313"]
    
    for nit in nits_prueba:
        probar_consulta(nit)
    
    print("\n" + "="*60)
    print("✅ Pruebas completadas")
    print("="*60 + "\n")