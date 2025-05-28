from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import re

class ComplexityPasswordValidator:
    """
    Valida que la contraseña cumpla con requisitos de complejidad:
    - Al menos una letra mayúscula
    - Al menos una letra minúscula
    - Al menos un número
    """
    
    def __init__(self, min_length=8):
        self.min_length = min_length

    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("La contraseña debe contener al menos una letra mayúscula."),
                code='password_no_upper',
            )
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("La contraseña debe contener al menos una letra minúscula."),
                code='password_no_lower',
            )
        if not re.search(r'[0-9]', password):
            raise ValidationError(
                _("La contraseña debe contener al menos un número."),
                code='password_no_number',
            )
        if len(password) < self.min_length:
            raise ValidationError(
                _("La contraseña debe tener al menos %(min_length)d caracteres."),
                code='password_too_short',
                params={'min_length': self.min_length},
            )

    def get_help_text(self):
        return _(
            "Tu contraseña debe contener al menos una letra mayúscula, "
            "una letra minúscula, un número y "
            "tener una longitud mínima de %(min_length)d caracteres."
        ) % {'min_length': self.min_length} 