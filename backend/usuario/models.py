from django.contrib.auth.models import AbstractUser
from django.db import models

class RolUsuario(models.TextChoices):
    INVESTIGADOR = 'INVESTIGADOR', 'Investigador'
    PARTICIPANTE = 'PARTICIPANTE', 'Participante'

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=20, choices=RolUsuario.choices)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Investigador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)

class Participante(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
