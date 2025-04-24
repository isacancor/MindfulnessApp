from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.auth.validators import UnicodeUsernameValidator

class RoleUsuario(models.TextChoices):
    ADMIN = 'ADMIN', 'Administrador'
    INVESTIGADOR = 'INVESTIGADOR', 'Investigador'
    PARTICIPANTE = 'PARTICIPANTE', 'Participante'

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
    MENOS_6_MESES = 'menos de 6 meses', _('Menos de 6 meses')
    ENTRE_6_12_MESES = '6 meses - 1 año', _('6 meses - 1 año')
    ENTRE_1_2_ANOS = '1 - 2 años', _('1 - 2 años')
    MAS_2_ANOS = 'más de 2 años', _('Más de 2 años')

class Usuario(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(
        max_length=150,
        unique=True,
        help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.',
        validators=[UnicodeUsernameValidator()],
        error_messages={
            'unique': "A user with that username already exists.",
        },
    )
    role = models.CharField(
        max_length=20, 
        choices=RoleUsuario.choices,
        default=RoleUsuario.PARTICIPANTE
    )
    fecha_nacimiento = models.DateField(null=True)
    genero = models.CharField(
        max_length=20,
        choices=[
            ('masculino', _('Masculino')),
            ('femenino', _('Femenino')),
            ('otro', _('Otro')),
            ('prefiero_no_decir', _('Prefiero no decir')),
        ],
        default='prefiero_no_decir'
    )
    date_joined = models.DateTimeField(default=timezone.now, editable=False)

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    def __str__(self):
        return self.email

    @property
    def nombre_completo(self):
        return f"{self.first_name} {self.last_name}"

    def is_investigador(self):
        return self.role == RoleUsuario.INVESTIGADOR

    def is_participante(self):
        return self.role == RoleUsuario.PARTICIPANTE

    def is_admin(self):
        return self.role == RoleUsuario.ADMIN

class Investigador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_investigador')
    telefono = models.CharField(max_length=20, blank=True)
    ocupacion = models.CharField(max_length=100, blank=True)
    nivel_educativo = models.CharField(
        max_length=50,
        choices=NivelEducativo.choices,
        default=NivelEducativo.UNIVERSIDAD,
        blank=True
    )
    areas_interes = models.JSONField(default=list, blank=True)
    experiencia_investigacion = models.CharField(
        max_length=20,
        choices=[
            ('Sí', _('Sí')),
            ('No', _('No')),
            ('En parte', _('En parte')),
        ],
        default='No',
        blank=True
    )
    ubicacion = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Investigador: {self.usuario.nombre_completo}"

class Participante(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_participante')
    ocupacion = models.CharField(max_length=100, blank=True)
    nivel_educativo = models.CharField(
        max_length=50,
        choices=NivelEducativo.choices,
        default=NivelEducativo.UNIVERSIDAD,
        blank=True
    )
    experiencia_mindfulness = models.CharField(
        max_length=20,
        choices=ExperienciaMindfulness.choices,
        default=ExperienciaMindfulness.NINGUNA,
        blank=True
    )
    condiciones_salud = models.TextField(blank=True)

    def __str__(self):
        return f"Participante: {self.usuario.nombre_completo}"
