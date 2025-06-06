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
                formato: formato
            },
            responseType: 'blob'
        }
    );

    const extension = getFileExtension(formato);
    downloadFile(responsePre.data, `cuestionario_pre_${programaId}.${extension}`);

    // Descargar cuestionario post
    const responsePost = await api.get(
        `/programas/${programaId}/exportar/`,
        {
            params: {
                tipo: 'cuestionarios',
                formato: formato
            },
            responseType: 'blob'
        }
    );

    downloadFile(responsePost.data, `cuestionario_post_${programaId}.${extension}`);
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

    const extension = getFileExtension(formato);
    downloadFile(response.data, `diarios_programa_${programaId}.${extension}`);
};

/**
 * Exporta datos generales de un programa
 * @param {number} programaId - ID del programa
 * @param {string} tipoExportacion - Tipo de datos a exportar
 * @param {string} formato - Formato de exportación
 */
const exportarDatosGenerales = async (programaId, tipoExportacion, formato) => {
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

    const extension = getFileExtension(formato);
    downloadFile(response.data, `programa_${programaId}_datos.${extension}`);
};

export {
    exportarCuestionarios,
    exportarDiarios,
    exportarDatosGenerales
}; 