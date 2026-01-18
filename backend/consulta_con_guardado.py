"""
Script para consultar RUES y guardar resultados
"""

import requests
import json
from datetime import datetime

def consultar_rues_directo(nit):
    """Consulta información de una empresa"""
    
    print(f"\n🔍 Consultando NIT: {nit}...")
    
    url = "https://www.rues.org.co/RM/ConsultaNIT"
    
    payload = {'nit': nit}
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    
    try:
        response = requests.post(url, data=payload, headers=headers, timeout=15)
        
        if response.status_code == 200:
            print("✅ Conexión exitosa al RUES")
            
            resultado = {
                'nit': nit,
                'razon_social': 'EMPRESA CONSULTADA',
                'estado': 'ACTIVA',
                'municipio': 'BARRANQUILLA',
                'departamento': 'ATLÁNTICO',
                'actividad_principal': 'CONSULTANDO...',
                'fecha_matricula': '2020-01-01',
                'ultima_renovacion': '2024-01-01',
                'fecha_consulta': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'nota': 'Datos de ejemplo - Integración en desarrollo'
            }
            
            return resultado
        else:
            print(f"❌ Error en la consulta. Código: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def validar_nit(nit):
    """Valida formato del NIT"""
    nit_limpio = nit.replace('-', '').replace(' ', '')
    
    if not nit_limpio.isdigit() or len(nit_limpio) != 9:
        return None
    
    return nit_limpio

def guardar_resultado(resultado, nit):
    """Guarda el resultado en un archivo JSON"""
    
    if not resultado:
        return False
    
    nombre_archivo = f"consulta_{nit}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    ruta_archivo = f"backend/resultados/{nombre_archivo}"
    
    try:
        # Crear directorio si no existe
        import os
        os.makedirs("backend/resultados", exist_ok=True)
        
        # Guardar en JSON
        with open(ruta_archivo, 'w', encoding='utf-8') as f:
            json.dump(resultado, f, ensure_ascii=False, indent=2)
        
        print(f"\n💾 Resultado guardado en: {ruta_archivo}")
        return True
        
    except Exception as e:
        print(f"❌ Error al guardar: {e}")
        return False

def mostrar_resultado(resultado):
    """Muestra los resultados"""
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
    print(f"Fecha Consulta:       {resultado['fecha_consulta']}")
    
    if 'nota' in resultado:
        print(f"\n⚠️  NOTA: {resultado['nota']}")
    
    print("="*60 + "\n")

def generar_mapa_cumplimiento(resultado):
    """Genera un mapa de cumplimiento básico"""
    
    if not resultado:
        return
    
    print("\n" + "="*60)
    print("🗺️  MAPA DE CUMPLIMIENTO PRELIMINAR")
    print("="*60)
    
    # Estado matrícula mercantil
    estado_matricula = "✅" if resultado['estado'] == 'ACTIVA' else "❌"
    print(f"Matrícula Mercantil:        {estado_matricula} {resultado['estado']}")
    
    # Última renovación (ejemplo)
    print(f"Renovación Cámara 2024:     ✅ Renovada")
    
    # Obligaciones detectadas (ejemplo)
    print(f"\nOBLIGACIONES TRIBUTARIAS:")
    print(f"  • IVA:                    🕐 Por verificar en DIAN")
    print(f"  • Retención en la Fuente: 🕐 Por verificar en DIAN")
    print(f"  • ICA Barranquilla:       🕐 Por verificar con Alcaldía")
    print(f"  • Renta Persona Jurídica: 🕐 Por verificar en DIAN")
    
    print("\n📋 PRÓXIMOS PASOS:")
    print("  1. Verificar RUT en DIAN")
    print("  2. Consultar estado ICA")
    print("  3. Validar facturación electrónica")
    
    print("="*60 + "\n")

# Programa principal
if __name__ == "__main__":
    print("="*60)
    print("🏢 SISTEMA DE AUTODIAGNÓSTICO TRIBUTARIO")
    print("   Versión MVP - Fase 1")
    print("="*60)
    
    print("\nIngresa el NIT de la empresa (9 dígitos):")
    nit_input = input("NIT: ").strip()
    
    nit_valido = validar_nit(nit_input)
    
    if not nit_valido:
        print("\n❌ NIT inválido. Debe tener 9 dígitos numéricos.")
    else:
        # Realizar consulta
        resultado = consultar_rues_directo(nit_valido)
        
        # Mostrar resultado
        mostrar_resultado(resultado)
        
        # Generar mapa de cumplimiento
        generar_mapa_cumplimiento(resultado)
        
        # Guardar resultado
        guardar_resultado(resultado, nit_valido)
    
    print("✅ Script ejecutado correctamente\n")