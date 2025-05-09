import { ensureHttps } from './url';

export const prepareSessionFormData = (formData, originalData = null) => {
    const formToSend = new FormData();

    // Agregar campos básicos
    Object.keys(formData).forEach(key => {
        if (key !== 'contenido_temporizador' &&
            key !== 'contenido_url' &&
            key !== 'contenido_audio' &&
            key !== 'contenido_video' &&
            formData[key] !== null) {
            formToSend.append(key, formData[key]);
        }
    });

    // Limpiar campos de contenido no utilizados
    if (originalData && originalData.tipo_contenido !== formData.tipo_contenido) {
        formToSend.append('limpiar_contenido', true);
        formToSend.append('tipo_contenido_anterior', originalData.tipo_contenido);
    }

    // Agregar contenido según el tipo
    switch (formData.tipo_contenido) {
        case 'temporizador':
            formToSend.append('contenido_temporizador', formData.contenido_temporizador || 0);
            break;
        case 'enlace':
            if (formData.contenido_url) {
                formToSend.append('contenido_url', ensureHttps(formData.contenido_url));
            }
            break;
        case 'audio':
            if (formData.contenido_audio instanceof File) {
                // Si hay un archivo existente y se está subiendo uno nuevo, marcar para limpiar
                if (originalData && originalData.contenido_audio) {
                    formToSend.append('limpiar_contenido', true);
                    formToSend.append('tipo_contenido_anterior', 'audio');
                }
                formToSend.append('contenido_audio', formData.contenido_audio);
            } else if (formData.contenido_audio && typeof formData.contenido_audio === 'string') {
                formToSend.append('contenido_audio_existente', formData.contenido_audio);
            }
            break;
        case 'video':
            if (formData.contenido_video instanceof File) {
                // Si hay un archivo existente y se está subiendo uno nuevo, marcar para limpiar
                if (originalData && originalData.contenido_video) {
                    formToSend.append('limpiar_contenido', true);
                    formToSend.append('tipo_contenido_anterior', 'video');
                }
                formToSend.append('contenido_video', formData.contenido_video);
            } else if (formData.contenido_video && typeof formData.contenido_video === 'string') {
                formToSend.append('contenido_video_existente', formData.contenido_video);
            }
            break;
    }

    return formToSend;
}; 