from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.auth.validators import UnicodeUsernameValidator

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

class Usuario(AbstractUser):
    nombre = models.CharField(_("first name"), max_length=150, blank=True)
    apellidos = models.CharField(_("last name"), max_length=150, blank=True)
    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[UnicodeUsernameValidator()],
        error_messages={
            'unique': "Ya existe un usuario con este nombre de usuario.",
        },
    )
    password = models.CharField(_("password"), max_length=128)
    email = models.EmailField(
        unique=True,
        error_messages={
            'unique': "Ya existe un usuario con este email.",
        },
    )
    telefono = models.CharField(max_length=20, blank=True, null=True)
    genero = models.CharField(
        max_length=20,
        choices=Genero.choices,
        default=Genero.PREFIERO_NO_DECIR
    )
    fechaNacimiento = models.DateField(null=True)
    ubicacion = models.CharField(max_length=100, blank=True)
    ocupacion = models.CharField(max_length=100, blank=True)
    nivelEducativo = models.CharField(
        max_length=50,
        choices=NivelEducativo.choices,
        default=NivelEducativo.UNIVERSIDAD,
        blank=True
    )
    role = models.CharField(
        max_length=20, 
        choices=RoleUsuario.choices,
        default=RoleUsuario.PARTICIPANTE
    )
    date_joined = models.DateTimeField(default=timezone.now, editable=False)
    first_name = None
    last_name = None

    REQUIRED_FIELDS = ['email', 'nombre', 'apellidos']

    def __str__(self):
        return self.email

    @property
    def nombre_completo(self):
        return f"{self.nombre} {self.apellidos}"

    def is_investigador(self):
        return self.role == RoleUsuario.INVESTIGADOR

    def is_participante(self):
        return self.role == RoleUsuario.PARTICIPANTE

    def is_admin(self):
        return self.role == RoleUsuario.ADMIN

class Investigador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_investigador')
    experienciaInvestigacion = models.CharField(
        max_length=20,
        choices=ExperienciaInvestigacion.choices,
        default=ExperienciaInvestigacion.NO,
        blank=True
    )
    areasInteres = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Investigador: {self.usuario.nombre_completo}"

class Participante(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_participante')
    experienciaMindfulness = models.CharField(
        max_length=20,
        choices=ExperienciaMindfulness.choices,
        default=ExperienciaMindfulness.NINGUNA,
        blank=True
    )
    condicionesSalud = models.TextField(blank=True)

    def __str__(self):
        return f"Participante: {self.usuario.nombre_completo}"
