import api from '../config/axios';

/**
 * Descarga un archivo usando un enlace temporal
 * @param {Blob} data - Los datos del archivo
 * @param {string} filename - Nombre del archivo con extensión
 */
const downloadFile = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

/**
 * Obtiene la extensión correcta según el formato
 * @param {string} formato - Formato del archivo (csv, excel, json)
 * @returns {string} Extensión del archivo
 */
const getFileExtension = (formato) => {
    return formato === 'excel' ? 'xlsx' : formato;
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
        'cuestionario_pre': `cuestionario_previo_programa_${programaId}_${fecha}`,
        'cuestionario_post': `cuestionario_posterior_programa_${programaId}_${fecha}`
    };

    return `${nombresArchivo[tipo]}.${extension}`;
};

/**
 * Exporta los cuestionarios de un programa
 * @param {number} programaId - ID del programa
 * @param {string} formato - Formato de exportación
 */
const exportarCuestionarios = async (programaId, formato) => {
    // Descargar cuestionario pre
    const responsePre = await api.get(
        `/programas/${programaId}/exportar/`,
        {
            params: {
                tipo: 'cuestionarios',
                subtipo: 'pre',
                formato: formato
            },
            responseType: 'blob'
        }
    );

    downloadFile(responsePre.data, getFileName(programaId, 'cuestionario_pre', formato));

    // Descargar cuestionario post
    const responsePost = await api.get(
        `/programas/${programaId}/exportar/`,
        {
            params: {
                tipo: 'cuestionarios',
                subtipo: 'post',
                formato: formato
            },
            responseType: 'blob'
        }
    );

    downloadFile(responsePost.data, getFileName(programaId, 'cuestionario_post', formato));
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
 * Exporta todos los datos de un programa
 * @param {number} programaId - ID del programa
 * @param {string} formato - Formato de exportación
 */
const exportarTodosLosDatos = async (programaId, formato) => {
    // Exportar participantes
    await exportarDatosGenerales(programaId, 'participantes', formato);

    // Exportar diarios
    await exportarDiarios(programaId, formato);

    // Exportar cuestionarios
    await exportarCuestionarios(programaId, formato);
};

/**
 * Exporta datos generales de un programa
 * @param {number} programaId - ID del programa
 * @param {string} tipoExportacion - Tipo de datos a exportar
 * @param {string} formato - Formato de exportación
 */
const exportarDatosGenerales = async (programaId, tipoExportacion, formato) => {
    if (tipoExportacion === 'todos') {
        await exportarTodosLosDatos(programaId, formato);
        return;
    }

    const response = await api.get(
        `/programas/${programaId}/exportar/`,
        {
            params: {
                tipo: tipoExportacion,
                formato: formato
            },
            responseType: 'blob'
        }
    );

    downloadFile(response.data, getFileName(programaId, tipoExportacion, formato));
};

export {
    exportarCuestionarios,
    exportarDiarios,
    exportarDatosGenerales,
    exportarTodosLosDatos
}; 