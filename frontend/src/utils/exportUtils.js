import api from '../config/axios';

/**
 * Función para descargar un archivo
 * @param {Blob} data - Datos del archivo
 * @param {string} filename - Nombre del archivo
 */
const downloadFile = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

/**
 * Obtiene la extensión del archivo según el formato
 * @param {string} formato - Formato del archivo
 * @returns {string} Extensión del archivo
 */
const getFileExtension = (formato) => {
    const extensiones = {
        'csv': 'csv',
        'excel': 'xlsx',
        'json': 'json'
    };
    return extensiones[formato] || 'csv';
};

/**
 * Obtiene el nombre del archivo según el tipo de datos y formato
 * @param {number} programaId - ID del programa
 * @param {string} tipo - Tipo de datos
 * @param {string} formato - Formato del archivo
 * @returns {string} Nombre del archivo
 */
const getFileName = (programaId, tipo, formato) => {
    const extension = getFileExtension(formato);
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const nombresArchivo = {
        'participantes': `participantes_programa_${programaId}_${fecha}`,
        'diarios': `diarios_sesiones_programa_${programaId}_${fecha}`,
        'cuestionarios': `cuestionarios_programa_${programaId}_${fecha}`,
        'todos': `datos_completos_programa_${programaId}_${fecha}`
    };

    // Para cuestionarios y todos los datos, ahora se descarga un ZIP
    if (tipo === 'cuestionarios' || tipo === 'todos') {
        return `${nombresArchivo[tipo]}.zip`;
    }

    return `${nombresArchivo[tipo]}.${extension}`;
};

/**
 * Exporta los cuestionarios de un programa (devuelve un ZIP)
 * @param {number} programaId - ID del programa
 * @param {string} formato - Formato de exportación
 */
const exportarCuestionarios = async (programaId, formato) => {
    const response = await api.get(
        `/programas/${programaId}/exportar/`,
        {
            params: {
                tipo: 'cuestionarios',
                formato: formato
            },
            responseType: 'blob'
        }
    );

    downloadFile(response.data, getFileName(programaId, 'cuestionarios', formato));
};

/**
 * Exporta los diarios de un programa
 * @param {number} programaId - ID del programa
 * @param {string} formato - Formato de exportación
 */
const exportarDiarios = async (programaId, formato) => {
    const response = await api.get(
        `/programas/${programaId}/exportar/`,
        {
            params: {
                tipo: 'diarios',
                formato: formato
            },
            responseType: 'blob'
        }
    );

    downloadFile(response.data, getFileName(programaId, 'diarios', formato));
};

/**
 * Exporta todos los datos de un programa (devuelve un ZIP)
 * @param {number} programaId - ID del programa
 * @param {string} formato - Formato de exportación
 */
const exportarTodosLosDatos = async (programaId, formato) => {
    const response = await api.get(
        `/programas/${programaId}/exportar/`,
        {
            params: {
                tipo: 'todos',
                formato: formato
            },
            responseType: 'blob'
        }
    );

    downloadFile(response.data, getFileName(programaId, 'todos', formato));
};

/**
 * Exporta datos generales de un programa
 * @param {number} programaId - ID del programa
 * @param {string} tipoExportacion - Tipo de exportación
 * @param {string} formato - Formato de exportación
 */
const exportarDatosGenerales = async (programaId, tipoExportacion, formato) => {
    if (tipoExportacion === 'todos') {
        await exportarTodosLosDatos(programaId, formato);
    } else if (tipoExportacion === 'cuestionarios') {
        await exportarCuestionarios(programaId, formato);
    } else if (tipoExportacion === 'diarios') {
        await exportarDiarios(programaId, formato);
    } else if (tipoExportacion === 'participantes') {
        const response = await api.get(
            `/programas/${programaId}/exportar/`,
            {
                params: {
                    tipo: 'participantes',
                    formato: formato
                },
                responseType: 'blob'
            }
        );

        downloadFile(response.data, getFileName(programaId, 'participantes', formato));
    }
};

export {
    exportarCuestionarios,
    exportarDiarios,
    exportarDatosGenerales,
    exportarTodosLosDatos
}; 