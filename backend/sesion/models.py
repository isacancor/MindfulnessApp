from django.db import models
from programa.models import Programa, ProgramaParticipante
from usuario.models import Participante
from django.utils import timezone

class EtiquetaPractica(models.TextChoices):
    FOCUS_ATTENTION = 'focus_attention', 'Atención Focalizada'
    OPEN_MONITORING = 'open_monitoring', 'Monitoreo Abierto'
    LOVING_KINDNESS = 'loving_kindness', 'Amorosa Bondad'
    BODY_SCAN = 'body_scan', 'Escaneo Corporal'
    MINDFUL_MOVEMENT = 'mindful_movement', 'Movimiento Consciente'
    SELF_COMPASSION = 'self_compassion', 'Auto-compasión'
    OTRO = 'otro', 'Otro'

class TipoContenido(models.TextChoices):
    TEMPORIZADOR = 'temporizador', 'Temporizador'
    ENLACE = 'enlace', 'Enlace'
    AUDIO = 'audio', 'Audio'
    VIDEO = 'video', 'Video'

class Sesion(models.Model):
    programa = models.ForeignKey(Programa, on_delete=models.CASCADE, related_name='sesiones')
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True, null=True)
    semana = models.PositiveIntegerField(help_text="Número de semana en el programa")
    duracion_estimada = models.PositiveIntegerField(help_text="Duración estimada en minutos", blank=True, null=True)
    tipo_practica = models.CharField(
        max_length=50,
        choices=EtiquetaPractica.choices,
        default=EtiquetaPractica.FOCUS_ATTENTION
    )
    tipo_contenido = models.CharField(
        max_length=50,
        choices=TipoContenido.choices,
        default=TipoContenido.TEMPORIZADOR
    )
    contenido_temporizador = models.PositiveIntegerField(blank=True, null=True, help_text="Duración del temporizador en minutos")
    contenido_url = models.URLField(blank=True, null=True, help_text="URL para contenido externo o cargado")
    contenido_audio = models.FileField(upload_to='audio/', blank=True, null=True, help_text="Archivo de audio")
    contenido_video = models.FileField(upload_to='video/', blank=True, null=True, help_text="Archivo de video")
    
    class Meta:
        ordering = ['programa', 'semana']
        unique_together = ['programa', 'semana']
    
    def __str__(self):
        return f"{self.programa.nombre} - Semana {self.semana}: {self.titulo}"
    
    def esta_disponible_para(self, participante):
        try:
            inscripcion = ProgramaParticipante.objects.get(
                programa=self.programa, 
                participante=participante,
                activo=True
            )
            fecha_inicio_semana = inscripcion.fecha_inicio + timezone.timedelta(weeks=self.semana-1)
            fecha_fin_semana = fecha_inicio_semana + timezone.timedelta(weeks=1)
            ahora = timezone.now()
            return fecha_inicio_semana <= ahora <= fecha_fin_semana
        except ProgramaParticipante.DoesNotExist:
            return False

class DiarioRespuesta(models.Model):
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE, related_name='diarios')
    sesion = models.ForeignKey(Sesion, on_delete=models.CASCADE, related_name='diarios')
    valoracion = models.IntegerField(help_text="Valor numérico de la respuesta (1-5, 0-10, etc.)")
    comentario = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-fecha_creacion']
        unique_together = ['participante', 'sesion']
    
    def __str__(self):
        return f"Diario de {self.participante.usuario.email} - {self.sesion.titulo}"
