"""
Configuración específica para tests.
Usa SQLite en memoria para tests más rápidos y sin necesidad de permisos.
"""
from config.settings import *

# Base de datos en memoria para tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# Desactivar migraciones para tests más rápidos
class DisableMigrations:
    def __contains__(self, item):
        return True
    
    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Configuración para tests
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',  # Más rápido para tests
]

# Desactivar logging durante tests
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
    },
    'root': {
        'handlers': ['null'],
    },
}

# Email backend para tests
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Cache dummy para tests
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Configuración de media para tests
MEDIA_ROOT = '/tmp/test_media'

# Debug False en tests
DEBUG = False

# Secret key para tests
SECRET_KEY = 'test-secret-key-for-tests-only' 