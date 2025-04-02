from django.db import models
from programa.models import Programa

class Sesion(models.Model):
    programa = models.ForeignKey(Programa, on_delete=models.CASCADE, related_name='sesiones')
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    orden = models.PositiveIntegerField()
    fecha_disponible = models.DateField()
    duracion_minutos = models.PositiveIntegerField()
