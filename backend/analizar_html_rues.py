"""
Script para analizar la estructura HTML del RUES
"""

import requests
from bs4 import BeautifulSoup

def obtener_html_rues(nit):
    """Obtiene el HTML del RUES para un NIT"""
    url = "https://www.rues.org.co/RM/ConsultaNIT"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    
    payload = {'nit': nit}
    
    try:
        response = requests.post(url, data=payload, headers=headers, timeout=15)
        
        if response.status_code == 200:
            return response.text
        else:
            return None
            
    except Exception as e:
        print(f"Error: {e}")
        return None

def analizar_estructura(html):
    """Analiza y muestra la estructura del HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    
    print("\n" + "="*60)
    print("📊 ANÁLISIS DE ESTRUCTURA HTML")
    print("="*60)
    
    # 1. Buscar todas las tablas
    print("\n1️⃣ TABLAS ENCONTRADAS:")
    tablas = soup.find_all('table')
    print(f"   Total: {len(tablas)} tablas")
    
    for i, tabla in enumerate(tablas, 1):
        print(f"\n   Tabla {i}:")
        # Mostrar primeras filas
        filas = tabla.find_all('tr')[:5]
        for fila in filas:
            celdas = fila.find_all(['td', 'th'])
            if celdas:
                texto = ' | '.join([c.get_text(strip=True)[:50] for c in celdas])
                print(f"      {texto}")
    
    # 2. Buscar divs importantes
    print("\n2️⃣ DIVS CON CLASE:")
    divs_con_clase = soup.find_all('div', class_=True)
    clases_unicas = set()
    for div in divs_con_clase:
        clases_unicas.update(div.get('class', []))
    
    for clase in sorted(clases_unicas)[:20]:
        print(f"   - {clase}")
    
    # 3. Buscar spans y strong con texto
    print("\n3️⃣ ETIQUETAS STRONG (primeras 20):")
    strongs = soup.find_all('strong')
    for strong in strongs[:20]:
        texto = strong.get_text(strip=True)
        if texto:
            print(f"   - {texto}")
    
    # 4. Buscar IDs
    print("\n4️⃣ ELEMENTOS CON ID:")
    elementos_con_id = soup.find_all(id=True)
    for elemento in elementos_con_id[:20]:
        print(f"   - {elemento.name}#{elemento.get('id')}")
    
    # 5. Guardar HTML completo para inspección
    with open('backend/rues_html_muestra.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("\n📄 HTML completo guardado en: backend/rues_html_muestra.html")

if __name__ == "__main__":
    print("="*60)
    print("🔬 ANÁLISIS DE HTML DEL RUES")
    print("="*60)
    
    nit = "890903938"  # Bancolombia
    
    print(f"\n🔍 Obteniendo HTML para NIT: {nit}")
    html = obtener_html_rues(nit)
    
    if html:
        print(f"✅ HTML obtenido ({len(html)} caracteres)")
        analizar_estructura(html)
    else:
        print("❌ No se pudo obtener el HTML")
    
    print("\n" + "="*60)
    print("✅ Análisis completado")
    print("="*60)