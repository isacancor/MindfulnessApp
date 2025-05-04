from django.db import models
from usuario.models import Investigador, Participante

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
    ACT = 'ACT', 'ACT (Acceptance and Commitment Therapy)'
    DBT = 'DBT', 'DBT (Dialectical Behavior Therapy)'
    MSC = 'MSC', 'MSC (Mindful Self-Compassion)'
    MMT = 'MMT', 'MMT (Mindfulness Meditation Training)'
    PROPIO = 'propio', 'Enfoque propio'
    OTRO = 'otro', 'Otro'

class Escala(models.TextChoices):
    EMOCIONAL = 'emocional', 'Estado emocional [1–5]'
    UTILIDAD = 'utilidad', 'Utilidad de la sesión [1–5]'
    ESTRES = 'estres', 'PSS (estrés) [0–4]'
    COMPROMISO = 'compromiso', 'UWES-3 (compromiso) [1–5]'
    BIENESTAR = 'bienestar', 'VAS (bienestar general) [0–10]'

class Programa(models.Model):
    # Identificación y Metadatos Generales
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    tipo_contexto = models.CharField(
        max_length=50,
        choices=TipoContexto.choices,
        default=TipoContexto.PERSONAL
    )
    enfoque_metodologico = models.CharField(
        max_length=50,
        choices=EnfoqueMetodologico.choices,
        default=EnfoqueMetodologico.MBSR
    )
    poblacion_objetivo = models.CharField(max_length=255, blank=True, null=True)
    
    # Configuración de Duración
    duracion_semanas = models.PositiveIntegerField()
    
    # Evaluaciones
    cuestionario_pre = models.URLField(max_length=500, blank=True, null=True)
    cuestionario_post = models.URLField(max_length=500, blank=True, null=True)
    escala = models.CharField(
        max_length=50,
        choices=Escala.choices,
        default=Escala.EMOCIONAL
    )
    
    # Relaciones
    creado_por = models.ForeignKey(Investigador, on_delete=models.CASCADE, related_name='programas')
    participantes = models.ManyToManyField(Participante, related_name='programas_inscritos', blank=True)
    
    # Metadatos
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

    class Meta:
        ordering = ['-fecha_creacion']
