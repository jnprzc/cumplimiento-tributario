/**
 * Script principal para el Sistema de Autodiagnóstico Tributario
 */

// URL de la API (cambiar cuando se despliegue en producción)
const API_URL = 'http://localhost:8000';

// Elementos del DOM
const consultaForm = document.getElementById('consultaForm');
const nitInput = document.getElementById('nitInput');
const consultarBtn = document.getElementById('consultarBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultadosSection = document.getElementById('resultadosSection');
const empresaInfo = document.getElementById('empresaInfo');
const scoreValue = document.getElementById('scoreValue');
const matriculaIcon = document.getElementById('matriculaIcon');
const matriculaEstado = document.getElementById('matriculaEstado');
const pasosList = document.getElementById('pasosList');
const leadForm = document.getElementById('leadForm');
const emailInput = document.getElementById('emailInput');

// Estado de la aplicación
let ultimaConsulta = null;

/**
 * Validar NIT
 */
function validarNIT(nit) {
    const nitLimpio = nit.replace(/[-\s]/g, '');
    
    if (!/^\d+$/.test(nitLimpio)) {
        return { valido: false, mensaje: 'El NIT debe contener solo números' };
    }
    
    if (nitLimpio.length !== 9) {
        return { valido: false, mensaje: 'El NIT debe tener 9 dígitos' };
    }
    
    return { valido: true, nit: nitLimpio };
}

/**
 * Mostrar error
 */
function mostrarError(mensaje) {
    errorText.textContent = mensaje;
    errorMessage.classList.remove('hidden');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

/**
 * Ocultar error
 */
function ocultarError() {
    errorMessage.classList.add('hidden');
}

/**
 * Mostrar loader en botón
 */
function mostrarLoader() {
    consultarBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
}

/**
 * Ocultar loader en botón
 */
function ocultarLoader() {
    consultarBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
}

/**
 * Consultar API
 */
async function consultarAPI(nit) {
    try {
        const response = await fetch(`${API_URL}/api/consultar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nit: nit })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error en la consulta');
        }
        
        return await response.json();
        
    } catch (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }
}

/**
 * Formatear NIT con puntos
 */
function formatearNIT(nit) {
    // Formato: 890.903.938
    return nit.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
}

/**
 * Mostrar información de la empresa
 */
function mostrarEmpresa(datos) {
    const { 
        nit, razon_social, estado, municipio, departamento, 
        actividad_principal, codigo_ciiu, fecha_matricula, 
        ultima_renovacion, tipo_sociedad, camara, tamano, 
        empleados_rango, responsabilidades_tributarias 
    } = datos;
    
    let html = `
        <div class="info-row">
            <span class="info-label">NIT:</span>
            <span class="info-value">${formatearNIT(nit)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Razón Social:</span>
            <span class="info-value">${razon_social}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Estado:</span>
            <span class="info-value">${estado}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Ubicación:</span>
            <span class="info-value">${municipio}, ${departamento}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Actividad Principal:</span>
            <span class="info-value">${actividad_principal}</span>
        </div>
    `;
    
    // Agregar información adicional si existe
    if (codigo_ciiu && codigo_ciiu !== 'N/A') {
        html += `
            <div class="info-row">
                <span class="info-label">Código CIIU:</span>
                <span class="info-value">${codigo_ciiu}</span>
            </div>
        `;
    }
    
    if (tipo_sociedad) {
        html += `
            <div class="info-row">
                <span class="info-label">Tipo de Sociedad:</span>
                <span class="info-value">${tipo_sociedad}</span>
            </div>
        `;
    }
    
    if (tamano) {
        html += `
            <div class="info-row">
                <span class="info-label">Tamaño:</span>
                <span class="info-value">${tamano}</span>
            </div>
        `;
    }
    
    if (empleados_rango) {
        html += `
            <div class="info-row">
                <span class="info-label">Empleados:</span>
                <span class="info-value">${empleados_rango}</span>
            </div>
        `;
    }
    
    html += `
        <div class="info-row">
            <span class="info-label">Cámara de Comercio:</span>
            <span class="info-value">${camara || 'Por determinar'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Fecha Matrícula:</span>
            <span class="info-value">${fecha_matricula}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Última Renovación:</span>
            <span class="info-value">${ultima_renovacion}</span>
        </div>
    `;
    
    // Mostrar responsabilidades tributarias si existen
    if (responsabilidades_tributarias && responsabilidades_tributarias.length > 0) {
        html += `
            <div class="info-row responsabilidades-row">
                <span class="info-label">Responsabilidades:</span>
                <div class="responsabilidades-lista">
                    ${responsabilidades_tributarias.map(resp => 
                        `<span class="responsabilidad-badge">${resp}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    empresaInfo.innerHTML = html;
}

/**
 * Mostrar mapa de cumplimiento
 */
function mostrarMapaCumplimiento(mapa) {
    // Actualizar score con animación
    animarScore(mapa.score);
    
    // Actualizar estado de matrícula
    const estadoMatricula = mapa.estado_matricula;
    matriculaIcon.textContent = estadoMatricula.icono;
    matriculaEstado.textContent = estadoMatricula.estado;
    
    // Mostrar próximos pasos
    pasosList.innerHTML = mapa.proximos_pasos
        .map(paso => `<li>${paso}</li>`)
        .join('');
}

/**
 * Animar el score
 */
function animarScore(targetScore) {
    let currentScore = 0;
    const increment = targetScore / 30; // 30 frames para la animación
    
    const interval = setInterval(() => {
        currentScore += increment;
        
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }
        
        scoreValue.textContent = Math.round(currentScore);
    }, 30);
}

/**
 * Mostrar resultados
 */
function mostrarResultados(data) {
    ultimaConsulta = data;
    
    // Mostrar información de la empresa
    mostrarEmpresa(data.datos_empresa);
    
    // Mostrar mapa de cumplimiento
    mostrarMapaCumplimiento(data.mapa_cumplimiento);
    
    // Mostrar sección de resultados
    resultadosSection.classList.remove('hidden');
    
    // Scroll suave a resultados
    resultadosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Manejar submit del formulario de consulta
 */
consultaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    ocultarError();
    
    // Validar NIT
    const nit = nitInput.value.trim();
    const validacion = validarNIT(nit);
    
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    
    // Mostrar loader
    mostrarLoader();
    
    try {
        // Consultar API
        const resultado = await consultarAPI(validacion.nit);
        
        // Mostrar resultados
        mostrarResultados(resultado);
        
    } catch (error) {
        mostrarError(error.message || 'Error al realizar la consulta. Por favor intenta de nuevo.');
    } finally {
        ocultarLoader();
    }
});

/**
 * Manejar submit del formulario de lead
 */
leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Por favor ingresa un email válido');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un email válido');
        return;
    }
    
    const submitBtn = leadForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Deshabilitar botón y mostrar loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    const leadData = {
        email: email,
        nit: ultimaConsulta?.nit,
        razon_social: ultimaConsulta?.datos_empresa?.razon_social,
        fecha: new Date().toISOString(),
        score: ultimaConsulta?.mapa_cumplimiento?.score
    };
    
    console.log('Lead capturado:', leadData);
    
    // Simular delay de red
    setTimeout(() => {
        // Mensaje de éxito más profesional
        const mensaje = `✅ ¡Listo! Hemos enviado el reporte completo a:\n${email}\n\nRevisa tu bandeja de entrada en los próximos minutos.`;
        alert(mensaje);
        
        emailInput.value = '';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // En producción, aquí se guardaría en tu CRM o base de datos
        // await guardarLead(leadData);
    }, 1000);
});

/**
 * Formatear input de NIT mientras se escribe
 */
nitInput.addEventListener('input', (e) => {
    // Remover todo lo que no sea número
    let valor = e.target.value.replace(/\D/g, '');
    
    // Limitar a 9 dígitos
    valor = valor.substring(0, 9);
    
    e.target.value = valor;
});

/**
 * Verificar si la API está disponible al cargar la página
 */
async function verificarAPI() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            console.log('✅ API disponible');
        }
    } catch (error) {
        console.warn('⚠️ API no disponible. Asegúrate de que esté corriendo en http://localhost:8000');
    }
}

// Verificar API al cargar
verificarAPI();