// Mapeo de géneros
const generoMap = {
    'masculino': 'Masculino',
    'femenino': 'Femenino',
    'otro': 'Otro',
    'prefiero_no_decir': 'Prefiero no decir'
};

// Mapeo de experiencia en investigación
const experienciaInvestigacionMap = {
    'Sí': 'Sí',
    'No': 'No',
    'En parte': 'En parte'
};

// Mapeo de niveles educativos
const nivelEducativoMap = {
    'sin_estudios': 'Sin Estudios',
    'primaria': 'Primaria',
    'secundaria': 'Secundaria',
    'bachillerato': 'Bachillerato',
    'formacion_profesional': 'Formación Profesional',
    'universidad': 'Universidad',
    'master': 'Máster',
    'doctorado': 'Doctorado',
    'otros': 'Otros'
};

// Mapeo de experiencia en mindfulness
const experienciaMindfulnessMap = {
    'ninguna': 'Ninguna',
    'menos_6_meses': 'Menos de 6 meses',
    '6_meses_1_ano': '6 meses - 1 año',
    '1_2_anos': '1 - 2 años',
    'mas_2_anos': 'Más de 2 años'
};

export const mapUserData = (user) => {
    if (!user) return null;

    return {
        ...user,
        genero: generoMap[user.genero] || user.genero,
        perfil_participante: user.perfil_participante ? {
            ...user.perfil_participante,
            nivelEducativo: nivelEducativoMap[user.perfil_participante.nivelEducativo] || user.perfil_participante.nivelEducativo,
            experienciaMindfulness: experienciaMindfulnessMap[user.perfil_participante.experienciaMindfulness] || user.perfil_participante.experienciaMindfulness
        } : null,
        perfil_investigador: user.perfil_investigador ? {
            ...user.perfil_investigador,
            experienciaInvestigacion: experienciaInvestigacionMap[user.perfil_investigador.experienciaInvestigacion] || user.perfil_investigador.experienciaInvestigacion
        } : null
    };
}; 