from django.db import models
from programa.models import Programa
from django.utils import timezone

class Cuestionario(models.Model):
    programa = models.ForeignKey(
        Programa, 
        on_delete=models.CASCADE, 
        related_name='cuestionarios'
    )
    tipo = models.CharField(
        max_length=10, 
        choices=[('pre', 'Pre'), ('post', 'Post')],
        default='pre'
    )
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(default='Sin descripción')
    preguntas = models.JSONField(default=list)
    fecha_creacion = models.DateTimeField(default=timezone.now)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['programa', 'tipo']

    def __str__(self):
        return f"{self.titulo} - {self.get_tipo_display()}"

class RespuestaCuestionario(models.Model):
    cuestionario = models.ForeignKey(
        Cuestionario, 
        on_delete=models.CASCADE, 
        related_name='respuestas'
    )
    usuario = models.ForeignKey(
        'usuario.Usuario', 
        on_delete=models.CASCADE, 
        related_name='respuestas_cuestionario'
    )
    respuestas = models.JSONField(default=dict)
    fecha_respuesta = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['cuestionario', 'usuario']

    def __str__(self):
        return f"Respuesta de {self.usuario} a {self.cuestionario}"
