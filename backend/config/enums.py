from django.db import models
from django.utils.translation import gettext_lazy as _

# Enums de Usuario
class RoleUsuario(models.TextChoices):
    ADMIN = 'ADMIN', 'Administrador'
    INVESTIGADOR = 'INVESTIGADOR', 'Investigador'
    PARTICIPANTE = 'PARTICIPANTE', 'Participante'

class Genero(models.TextChoices):
    MASCULINO = 'masculino', _('Masculino')
    FEMENINO = 'femenino', _('Femenino')
    TRANSGENERO = 'transgenero', _('Transgenero')
    NO_BINARIO = 'no_binario', _('No binario')
    OTRO = 'otro', _('Otro')
    PREFIERO_NO_DECIR = 'prefiero_no_decir', _('Prefiero no decir')

class NivelEducativo(models.TextChoices):
    SIN_ESTUDIOS = 'sin_estudios', _('Sin Estudios')
    PRIMARIA = 'primaria', _('Primaria')
    SECUNDARIA = 'secundaria', _('Secundaria')
    BACHILLERATO = 'bachillerato', _('Bachillerato')
    FP = 'formacion_profesional', _('Formación Profesional')
    UNIVERSIDAD = 'universidad', _('Universidad')
    MASTER = 'master', _('Master')
    DOCTORADO = 'doctorado', _('Doctorado')
    OTROS = 'otros', _('Otros')

class ExperienciaMindfulness(models.TextChoices):
    NINGUNA = 'ninguna', _('Ninguna')
    MENOS_6_MESES = 'menos_de_6_meses', _('Menos de 6 meses')
    ENTRE_6_12_MESES = '6_meses_1_ano', _('6 meses - 1 año')
    ENTRE_1_2_ANOS = '1_2_anos', _('1 - 2 años')
    MAS_2_ANOS = 'mas_de_2_anos', _('Más de 2 años')

class ExperienciaInvestigacion(models.TextChoices):
    SI = 'si', _('Sí')
    NO = 'no', _('No')
    EN_PARTE = 'en_parte', _('En parte')

# Enums de Programa
class TipoContexto(models.TextChoices):
    ACADEMICO = 'académico', 'Académico'
    LABORAL = 'laboral', 'Laboral'
    CLINICO = 'clínico/terapéutico', 'Clínico/Terapéutico'
    DEPORTIVO = 'deportivo', 'Deportivo'
    PERSONAL = 'personal/desarrollo individual', 'Personal/Desarrollo Individual'
    OTRO = 'otro', 'Otro'

class EnfoqueMetodologico(models.TextChoices):
    MBSR = 'MBSR', 'MBSR (Mindfulness-Based Stress Reduction)'
    MBCT = 'MBCT', 'MBCT (Mindfulness-Based Cognitive Therapy)'
    MSC = 'MSC', 'MSC (Mindful Self-Compassion)'
    MBRP = 'MBRP', 'MBRP (Mindfulness-Based Relapse Prevention)'
    MBPM = 'MBPM', 'MBPM (Mindfulness-Based Pain Management)'
    PROPIO = 'propio', 'Enfoque propio'
    OTRO = 'otro', 'Otro'

class EstadoPublicacion(models.TextChoices):
    BORRADOR = 'borrador', 'Borrador'
    PUBLICADO = 'publicado', 'Publicado'
    FINALIZADO = 'finalizado', 'Finalizado'

class EstadoPrograma(models.TextChoices):
    EN_PROGRESO = 'en progreso', 'En progreso'
    COMPLETADO = 'completado', 'Completado'

# Enums de Sesión
class EtiquetaPractica(models.TextChoices):
    BREATH = 'breath', 'Atención Focalizada en la Respiración'
    SOUNDS = 'sounds', 'Atención Focalizada en los Sonidos'
    VISUAL_OBJECT = 'visual_object', 'Atención Focalizada en un Objeto visual'
    SENSES = 'senses', 'Atención Focalizada en los Sentidos'
    OPEN_AWARENESS = 'open_awareness', 'Conciencia Abierta'
    LOVING_KINDNESS = 'loving_kindness', 'Loving Kindness (Bondad Amorosa)'
    BODY_SCAN = 'body_scan', 'Escaneo Corporal'
    SELF_COMPASSION = 'self_compassion', 'Auto-compasión'
    MINDFUL_MOVEMENT = 'mindful_movement', 'Movimiento Consciente'
    OTRO = 'otro', 'Otro'

class TipoContenido(models.TextChoices):
    TEMPORIZADOR = 'temporizador', 'Temporizador'
    ENLACE = 'enlace', 'Enlace'
    AUDIO = 'audio', 'Audio'
    VIDEO = 'video', 'Video'

class Escala(models.TextChoices):
    EMOCIONAL = 'emocional', 'Estado emocional [1–5]'
    UTILIDAD = 'utilidad', 'Utilidad de la sesión [1–5]'
    ESTRES = 'estres', 'PSS (estrés) [0–4]'
    BIENESTAR = 'bienestar', 'VAS (bienestar general) [0–10]'

# Enums de Cuestionario
class TipoCuestionario(models.TextChoices):
    PRE = 'pre', 'Pre'
    POST = 'post', 'Post' 