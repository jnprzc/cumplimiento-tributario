/**
 * Configuración de la aplicación
 */

const CONFIG = {
    // URLs de la API
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000' 
        : 'https://cumplimiento-tributario-production.up.railway.app',
    
    // Información de la empresa
    EMPRESA: {
        nombre: 'Corenta',
        nombreCompleto: 'Colombia Artesana y Empresaria SAS',
        website: 'https://corenta.co', // Tu dominio futuro
        email: 'contacto@corenta.co',
        telefono: '+57 xxx xxxx'
    },
    
    // Mensajes
    MENSAJES: {
        errorGenerico: 'Ocurrió un error. Por favor intenta de nuevo.',
        errorNIT: 'NIT inválido. Debe tener 9 dígitos numéricos.',
        errorConexion: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        nitNoEncontrado: 'No se encontró información para este NIT.',
        exito: '¡Consulta realizada con éxito!'
    },
    
    // Configuración de la aplicación
    APP: {
        version: '1.0.0',
        tipoAmbiente: 'MVP',
        mostrarDatosEjemplo: true
    }
};

// Hacer CONFIG disponible globalmente
window.CONFIG = CONFIG;