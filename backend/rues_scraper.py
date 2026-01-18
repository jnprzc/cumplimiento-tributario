"""
Scraper para obtener datos reales del RUES (Confecámaras)
"""

import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime

class RUESScraper:
    """
    Clase para hacer scraping del RUES de Confecámaras
    """
    
    def __init__(self):
        self.base_url = "https://www.rues.org.co"
        self.consulta_url = f"{self.base_url}/RM/ConsultaNIT"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
    
    def consultar(self, nit):
        """
        Consulta información de una empresa por NIT
        
        Args:
            nit (str): NIT de 9 dígitos
            
        Returns:
            dict: Datos de la empresa o None si hay error
        """
        try:
            # Hacer la petición POST
            payload = {'nit': nit}
            response = requests.post(
                self.consulta_url, 
                data=payload, 
                headers=self.headers, 
                timeout=15
            )
            
            if response.status_code != 200:
                return None
            
            # Parsear HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extraer datos
            datos = self._extraer_datos(soup, nit)
            
            return datos
            
        except Exception as e:
            print(f"Error en consulta RUES: {e}")
            return None
    
    def _extraer_datos(self, soup, nit):
        """
        Extrae información del HTML del RUES
        
        Args:
            soup: BeautifulSoup object
            nit: NIT consultado
            
        Returns:
            dict: Datos extraídos
        """
        datos = {
            'nit': nit,
            'razon_social': self._extraer_razon_social(soup),
            'estado': self._extraer_estado(soup),
            'municipio': self._extraer_municipio(soup),
            'departamento': self._extraer_departamento(soup),
            'actividad_principal': self._extraer_actividad(soup),
            'fecha_matricula': self._extraer_fecha_matricula(soup),
            'ultima_renovacion': self._extraer_ultima_renovacion(soup),
            'tipo_sociedad': self._extraer_tipo_sociedad(soup),
            'camara': self._extraer_camara(soup)
        }
        
        return datos
    
    def _extraer_texto_por_label(self, soup, label):
        """
        Busca un valor en el HTML basado en su label
        """
        try:
            # Buscar diferentes patrones comunes
            patterns = [
                # Patrón 1: <strong>Label:</strong> Valor
                soup.find('strong', string=re.compile(label, re.IGNORECASE)),
                # Patrón 2: <td>Label</td><td>Valor</td>
                soup.find('td', string=re.compile(label, re.IGNORECASE))
            ]
            
            for pattern in patterns:
                if pattern:
                    # Intentar obtener el siguiente elemento
                    siguiente = pattern.find_next_sibling()
                    if siguiente:
                        return siguiente.get_text(strip=True)
                    
                    # O el elemento padre y su siguiente hermano
                    parent = pattern.parent
                    if parent:
                        siguiente = parent.find_next_sibling()
                        if siguiente:
                            return siguiente.get_text(strip=True)
            
            return "No disponible"
            
        except:
            return "No disponible"
    
    def _extraer_razon_social(self, soup):
        """Extrae la razón social"""
        # Buscar en diferentes posibles ubicaciones
        posibles = [
            soup.find('td', string=re.compile('Razón Social', re.IGNORECASE)),
            soup.find('strong', string=re.compile('Razón Social', re.IGNORECASE)),
            soup.find(string=re.compile('Razón Social:', re.IGNORECASE))
        ]
        
        for pos in posibles:
            if pos:
                # Obtener el siguiente td o span
                siguiente = pos.find_next('td') if hasattr(pos, 'find_next') else None
                if siguiente:
                    return siguiente.get_text(strip=True)
        
        return "No disponible"
    
    def _extraer_estado(self, soup):
        """Extrae el estado de la matrícula"""
        estado = self._extraer_texto_por_label(soup, 'Estado')
        
        # Normalizar
        if 'activ' in estado.lower():
            return 'ACTIVA'
        elif 'inactiv' in estado.lower():
            return 'INACTIVA'
        elif 'cancelad' in estado.lower():
            return 'CANCELADA'
        
        return estado
    
    def _extraer_municipio(self, soup):
        """Extrae el municipio"""
        return self._extraer_texto_por_label(soup, 'Municipio')
    
    def _extraer_departamento(self, soup):
        """Extrae el departamento"""
        return self._extraer_texto_por_label(soup, 'Departamento')
    
    def _extraer_actividad(self, soup):
        """Extrae la actividad económica principal"""
        actividad = self._extraer_texto_por_label(soup, 'Actividad')
        if not actividad or actividad == "No disponible":
            actividad = self._extraer_texto_por_label(soup, 'CIIU')
        return actividad
    
    def _extraer_fecha_matricula(self, soup):
        """Extrae la fecha de matrícula"""
        fecha = self._extraer_texto_por_label(soup, 'Fecha.*Matrícula')
        return self._normalizar_fecha(fecha)
    
    def _extraer_ultima_renovacion(self, soup):
        """Extrae la última fecha de renovación"""
        fecha = self._extraer_texto_por_label(soup, 'Renovación')
        if not fecha or fecha == "No disponible":
            fecha = self._extraer_texto_por_label(soup, 'Última.*Renovación')
        return self._normalizar_fecha(fecha)
    
    def _extraer_tipo_sociedad(self, soup):
        """Extrae el tipo de sociedad"""
        return self._extraer_texto_por_label(soup, 'Tipo.*Sociedad')
    
    def _extraer_camara(self, soup):
        """Extrae la cámara de comercio"""
        return self._extraer_texto_por_label(soup, 'Cámara')
    
    def _normalizar_fecha(self, fecha_str):
        """
        Normaliza fechas a formato ISO (YYYY-MM-DD)
        """
        if not fecha_str or fecha_str == "No disponible":
            return "No disponible"
        
        try:
            # Intentar parsear diferentes formatos comunes
            formatos = [
                '%d/%m/%Y',
                '%d-%m-%Y',
                '%Y-%m-%d',
                '%d de %B de %Y'
            ]
            
            for formato in formatos:
                try:
                    fecha = datetime.strptime(fecha_str, formato)
                    return fecha.strftime('%Y-%m-%d')
                except:
                    continue
            
            return fecha_str
            
        except:
            return fecha_str

# Función helper para uso fácil
def consultar_rues(nit):
    """
    Función simple para consultar el RUES
    
    Args:
        nit (str): NIT de la empresa
        
    Returns:
        dict: Datos de la empresa
    """
    scraper = RUESScraper()
    return scraper.consultar(nit)


# Test
if __name__ == "__main__":
    print("="*60)
    print("🔍 TEST: RUES Scraper")
    print("="*60)
    
    # Probar con NITs conocidos
    nits_prueba = [
        "890903938",  # Bancolombia
        "860034313",  # Ecopetrol
    ]
    
    for nit in nits_prueba:
        print(f"\n📊 Consultando NIT: {nit}")
        print("-"*60)
        
        datos = consultar_rues(nit)
        
        if datos:
            print("✅ Datos obtenidos:")
            for key, value in datos.items():
                print(f"   {key}: {value}")
        else:
            print("❌ No se pudieron obtener datos")
    
    print("\n" + "="*60)
    print("✅ Test completado")
    print("="*60)