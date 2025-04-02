from django.db import models
from sesion.models import Sesion

class Cuestionario(models.Model):
    titulo = models.CharField(max_length=255)
    sesion = models.ForeignKey(Sesion, on_delete=models.CASCADE, related_name='cuestionarios')

class Pregunta(models.Model):
    cuestionario = models.ForeignKey(Cuestionario, on_delete=models.CASCADE, related_name='preguntas')
    texto = models.TextField()

class Respuesta(models.Model):
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name='respuestas')
    texto = models.TextField()
