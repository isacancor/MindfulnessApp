from django.db import models
from usuario.models import Usuario, Participante
from django.utils import timezone
from datetime import datetime, timedelta

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

class EstadoPublicacion(models.TextChoices):
    BORRADOR = 'borrador', 'Borrador'
    PUBLICADO = 'publicado', 'Publicado'

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
    
    # Estado de publicación
    estado_publicacion = models.CharField(
        max_length=20,
        choices=EstadoPublicacion.choices,
        default=EstadoPublicacion.BORRADOR
    )
    
    # Relaciones
    creado_por = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='programas')
    participantes = models.ManyToManyField(Participante, related_name='programas_inscritos', blank=True)
    
    # Metadatos
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_publicacion = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.nombre

    def publicar(self):
        if self.estado_publicacion == EstadoPublicacion.BORRADOR:
            self.estado_publicacion = EstadoPublicacion.PUBLICADO
            self.fecha_publicacion = timezone.now()
            self.save()

    def puede_ser_publicado(self):
        campos_requeridos = [
            self.nombre,
            self.descripcion,
            self.tipo_contexto,
            self.enfoque_metodologico,
            self.poblacion_objetivo,
            self.duracion_semanas,
            self.escala,
            self.creado_por
        ]
        
        # Verificar que tenga todas las sesiones necesarias
        sesiones_requeridas = set(range(1, self.duracion_semanas + 1))
        sesiones_existentes = set(self.sesiones.values_list('semana', flat=True))
        
        return all(campos_requeridos) and sesiones_requeridas == sesiones_existentes

    class Meta:
        ordering = ['-fecha_creacion']

class ProgramaParticipante(models.Model):
    programa = models.ForeignKey(Programa, on_delete=models.CASCADE, related_name='inscripciones')
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE, related_name='inscripciones')
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        unique_together = ('programa', 'participante')
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f"{self.participante} - {self.programa}"

    def calcular_fecha_fin(self):
        if not self.fecha_fin:
            self.fecha_fin = self.fecha_inicio + timedelta(weeks=self.programa.duracion_semanas)
            self.save()
        return self.fecha_fin

    def esta_activo(self):
        if not self.activo:
            return False
        fecha_fin = self.calcular_fecha_fin()
        return timezone.now() <= fecha_fin
