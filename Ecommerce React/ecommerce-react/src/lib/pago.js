/**
 * Módulo para gestionar el historial de pagos
 * Implementa una estructura de pila (stack) para almacenar las transacciones
 */

// Pila de pagos (almacenamiento en memoria - en producción usar backend/localStorage)
let historialPagos = [];

/**
 * Genera un ID único para cada pago
 */
const generarId = () => {
    return `PAG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Agrega un nuevo pago al historial (push a la pila)
 * @param {Object} pago - Objeto con los datos del pago
 * @returns {Object} - El pago con ID generado
 */
export const agregarPago = (pago) => {
    const pagoCompleto = {
        id: generarId(),
        fecha: new Date().toISOString(),
        estado: 'exitoso',
        ...pago
    };
    
    historialPagos.push(pagoCompleto);
    
    // Guardar en localStorage para persistencia
    try {
        localStorage.setItem('historialPagos', JSON.stringify(historialPagos));
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
    
    return pagoCompleto;
};

/**
 * Obtiene todo el historial de pagos
 * @returns {Array} - Array con todos los pagos
 */
export const obtenerHistorial = () => {
    // Intentar cargar desde localStorage al inicio
    if (historialPagos.length === 0) {
        try {
            const stored = localStorage.getItem('historialPagos');
            if (stored) {
                historialPagos = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error al cargar desde localStorage:', error);
        }
    }
    return [...historialPagos];
};

/**
 * Obtiene el último pago realizado (top de la pila)
 * @returns {Object|null} - El último pago o null si no hay pagos
 */
export const obtenerUltimoPago = () => {
    if (historialPagos.length === 0) {
        obtenerHistorial(); // Intentar cargar desde localStorage
    }
    return historialPagos.length > 0 ? historialPagos[historialPagos.length - 1] : null;
};

/**
 * Limpia todo el historial de pagos
 */
export const limpiarHistorial = () => {
    historialPagos = [];
    try {
        localStorage.removeItem('historialPagos');
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
    }
};

/**
 * Obtiene pagos por método de pago
 * @param {string} metodo - 'pago-movil' | 'visa' | 'transferencia'
 * @returns {Array} - Array de pagos filtrados
 */
export const obtenerPagosPorMetodo = (metodo) => {
    return obtenerHistorial().filter(pago => pago.metodoPago === metodo);
};

/**
 * Obtiene estadísticas del historial
 * @returns {Object} - Objeto con estadísticas
 */
export const obtenerEstadisticas = () => {
    const historial = obtenerHistorial();
    const total = historial.reduce((sum, pago) => sum + pago.monto, 0);
    
    return {
        totalPagos: historial.length,
        montoTotal: total,
        promedioCompra: historial.length > 0 ? total / historial.length : 0,
        metodosUsados: {
            pagoMovil: historial.filter(p => p.metodoPago === 'pago-movil').length,
            visa: historial.filter(p => p.metodoPago === 'visa').length,
            transferencia: historial.filter(p => p.metodoPago === 'transferencia').length
        }
    };
};
