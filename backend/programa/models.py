from django.db import models
from usuario.models import Investigador, Participante

class EstadoPrograma(models.TextChoices):
    ABIERTO = 'ABIERTO', 'Abierto'
    CERRADO = 'CERRADO', 'Cerrado'

class Programa(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    duracion = models.PositiveIntegerField()
    estado = models.CharField(max_length=10, choices=EstadoPrograma.choices, default=EstadoPrograma.ABIERTO)
    creado_por = models.ForeignKey(Investigador, on_delete=models.CASCADE, related_name='programas')
    participantes = models.ManyToManyField(Participante, related_name='programas_inscritos', blank=True)
