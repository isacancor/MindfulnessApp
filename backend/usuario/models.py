from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from config.enums import (
    RoleUsuario, Genero, NivelEducativo,
    ExperienciaMindfulness, ExperienciaInvestigacion
)

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

    def save(self, *args, **kwargs):
        if self._state.adding:  # Solo para nuevos usuarios
            try:
                validate_password(self.password, self)
            except ValidationError as e:
                raise ValidationError({'password': list(e.messages)})
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        if self._state.adding or self._password_changed:
            try:
                validate_password(self.password, self)
            except ValidationError as e:
                raise ValidationError({'password': list(e.messages)})

    def set_password(self, raw_password):
        try:
            validate_password(raw_password, self)
        except ValidationError as e:
            raise ValidationError({'password': list(e.messages)})
        super().set_password(raw_password)
        self._password_changed = True

    def get_role_display(self):
        return dict(RoleUsuario.choices).get(self.role, self.role)

    def get_genero_display(self):
        return dict(Genero.choices).get(self.genero, self.genero)

    def get_nivel_educativo_display(self):
        return dict(NivelEducativo.choices).get(self.nivelEducativo, self.nivelEducativo)

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

    def get_experiencia_investigacion_display(self):
        return dict(ExperienciaInvestigacion.choices).get(self.experienciaInvestigacion, self.experienciaInvestigacion)

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

    def get_experiencia_mindfulness_display(self):
        return dict(ExperienciaMindfulness.choices).get(self.experienciaMindfulness, self.experienciaMindfulness)

