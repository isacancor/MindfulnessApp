// Enums de Usuario
export const RoleUsuario = {
    ADMIN: { value: 'ADMIN', label: 'Administrador' },
    INVESTIGADOR: { value: 'INVESTIGADOR', label: 'Investigador' },
    PARTICIPANTE: { value: 'PARTICIPANTE', label: 'Participante' }
};

export const Genero = {
    MASCULINO: { value: 'masculino', label: 'Masculino' },
    FEMENINO: { value: 'femenino', label: 'Femenino' },
    TRANSGENERO: { value: 'transgenero', label: 'Transgenero' },
    NO_BINARIO: { value: 'no_binario', label: 'No binario' },
    OTRO: { value: 'otro', label: 'Otro' },
    PREFIERO_NO_DECIR: { value: 'prefiero_no_decir', label: 'Prefiero no decir' }
};

export const NivelEducativo = {
    SIN_ESTUDIOS: { value: 'sin_estudios', label: 'Sin Estudios' },
    PRIMARIA: { value: 'primaria', label: 'Primaria' },
    SECUNDARIA: { value: 'secundaria', label: 'Secundaria' },
    BACHILLERATO: { value: 'bachillerato', label: 'Bachillerato' },
    FP: { value: 'fp', label: 'Formación Profesional' },
    UNIVERSIDAD: { value: 'universidad', label: 'Universidad' },
    MASTER: { value: 'master', label: 'Master' },
    DOCTORADO: { value: 'doctorado', label: 'Doctorado' },
    OTROS: { value: 'otros', label: 'Otros' }
};

export const ExperienciaMindfulness = {
    NINGUNA: { value: 'ninguna', label: 'Ninguna' },
    MENOS_6_MESES: { value: 'menos_6_meses', label: 'Menos de 6 meses' },
    ENTRE_6_12_MESES: { value: 'entre_6_12_meses', label: '6 meses - 1 año' },
    ENTRE_1_2_ANOS: { value: 'entre_1_2_anos', label: '1 - 2 años' },
    ENTRE_2_10_ANOS: { value: 'entre_2_10_anos', label: '2 - 10 años' },
    MAS_10_ANOS: { value: 'mas_10_anos', label: 'Más de 10 años' }
};

export const ExperienciaInvestigacion = {
    SI: { value: 'si', label: 'Sí' },
    NO: { value: 'no', label: 'No' },
    EN_PARTE: { value: 'en_parte', label: 'En parte' }
};

// Enums de Programa
export const TipoContexto = {
    ACADEMICO: { value: 'académico', label: 'Académico' },
    LABORAL: { value: 'laboral', label: 'Laboral' },
    CLINICO: { value: 'clínico', label: 'Clínico/Terapéutico' },
    DEPORTIVO: { value: 'deportivo', label: 'Deportivo' },
    CRECIMIENTO_PERSONAL: { value: 'crecimiento_personal', label: 'Crecimiento Personal' },
    OTRO: { value: 'otro', label: 'Otro' }
};

export const EnfoqueMetodologico = {
    MBSR: { value: 'MBSR', label: 'MBSR (Mindfulness-Based Stress Reduction)' },
    MBCT: { value: 'MBCT', label: 'MBCT (Mindfulness-Based Cognitive Therapy)' },
    MSC: { value: 'MSC', label: 'MSC (Mindful Self-Compassion)' },
    MBRP: { value: 'MBRP', label: 'MBRP (Mindfulness-Based Relapse Prevention)' },
    MBPM: { value: 'MBPM', label: 'MBPM (Mindfulness-Based Pain Management)' },
    PROPIO: { value: 'propio', label: 'Enfoque propio' },
    OTRO: { value: 'otro', label: 'Otro' }
};

export const EstadoPublicacion = {
    BORRADOR: { value: 'borrador', label: 'Borrador' },
    PUBLICADO: { value: 'publicado', label: 'Publicado' },
    FINALIZADO: { value: 'finalizado', label: 'Finalizado' }
};

export const EstadoPrograma = {
    EN_PROGRESO: { value: 'en_progreso', label: 'En progreso' },
    COMPLETADO: { value: 'completado', label: 'Completado' }
};

// Enums de Sesión
export const EtiquetaPractica = {
    BREATH: { value: 'breath', label: 'Atención a la Respiración' },
    SOUNDS: { value: 'sounds', label: 'Atención a los Sonidos' },
    VISUAL_OBJECT: { value: 'visual_object', label: 'Atención a un Objeto visual' },
    SENSES: { value: 'senses', label: 'Atención a los Sentidos' },
    OPEN_AWARENESS: { value: 'open_awareness', label: 'Conciencia Abierta' },
    LOVING_KINDNESS: { value: 'loving_kindness', label: 'Loving Kindness (Bondad Amorosa)' },
    BODY_SCAN: { value: 'body_scan', label: 'Escaneo Corporal' },
    SELF_COMPASSION: { value: 'self_compassion', label: 'Auto-compasión' },
    MINDFUL_MOVEMENT: { value: 'mindful_movement', label: 'Movimiento Consciente' },
    OTRO: { value: 'otro', label: 'Otro' }
};

export const TipoContenido = {
    TEMPORIZADOR: { value: 'temporizador', label: 'Temporizador' },
    ENLACE: { value: 'enlace', label: 'Enlace' },
    AUDIO: { value: 'audio', label: 'Audio' },
    VIDEO: { value: 'video', label: 'Video' }
};

export const Escala = {
    EMOCIONAL: { value: 'emocional', label: 'Estado emocional [1–5]' },
    UTILIDAD: { value: 'utilidad', label: 'Utilidad de la sesión [1–5]' },
    ESTRES: { value: 'estres', label: 'PSS (estrés) [0–4]' },
    BIENESTAR: { value: 'bienestar', label: 'VAS (bienestar general) [0–10]' }
};

// Enums de Cuestionario
export const TipoCuestionario = {
    PRE: { value: 'pre', label: 'Pre' },
    POST: { value: 'post', label: 'Post' }
};

export const TipoPregunta = {
    TEXTO: { value: 'texto', label: 'Texto Libre' },
    SELECT: { value: 'select', label: 'Selección Única' },
    CHECKBOX: { value: 'checkbox', label: 'Múltiple Opción' },
    CALIFICACION: { value: 'calificacion', label: 'Calificación' },
    LIKERT: { value: 'likert', label: 'Escala Likert' },
    LIKERT_5_PUNTOS: { value: 'likert_5_puntos', label: 'Escala Likert 5 Puntos' }
};

export const TipoEscala = {
    ACUERDO: { value: 'acuerdo', label: 'Acuerdo' },
    FRECUENCIA: { value: 'frecuencia', label: 'Frecuencia' }
};

export const TipoIcono = {
    STAR: { value: 'star', label: 'Estrella', icon: 'Star' },
    HEART: { value: 'heart', label: 'Corazón', icon: 'Heart' },
    THUMBSUP: { value: 'thumbsup', label: 'Me gusta', icon: 'ThumbsUp' }
};

// Funciones auxiliares para convertir los enums a arrays para los selectores
export const getEnumArray = (enumArray) => Object.values(enumArray); 