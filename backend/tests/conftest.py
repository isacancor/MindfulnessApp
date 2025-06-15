import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tests.test_settings')
django.setup()

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from usuario.models import Investigador, Participante
from programa.models import Programa
from cuestionario.models import Cuestionario
from sesion.models import Sesion
from config.enums import RoleUsuario, EstadoPublicacion, MomentoCuestionario

Usuario = get_user_model()

@pytest.fixture
def api_client():
    """Cliente API para tests."""
    return APIClient()

@pytest.fixture
def usuario_participante():
    """Usuario participante para tests."""
    usuario = Usuario.objects.create_user(
        username='participante_test',
        email='participante@test.com',
        password='testpassword123',
        nombre='Juan',
        apellidos='Pérez',
        role=RoleUsuario.PARTICIPANTE
    )
    return usuario

@pytest.fixture
def usuario_investigador():
    """Usuario investigador para tests."""
    usuario = Usuario.objects.create_user(
        username='investigador_test',
        email='investigador@test.com',
        password='testpassword123',
        nombre='Dr. Ana',
        apellidos='García',
        role=RoleUsuario.INVESTIGADOR
    )
    return usuario

@pytest.fixture
def usuario_admin():
    """Usuario administrador para tests."""
    usuario = Usuario.objects.create_user(
        username='admin_test',
        email='admin@test.com',
        password='testpassword123',
        nombre='Admin',
        apellidos='Sistema',
        role=RoleUsuario.ADMIN,
        is_staff=True,
        is_superuser=True
    )
    return usuario

@pytest.fixture
def participante(usuario_participante):
    """Perfil de participante para tests."""
    return Participante.objects.create(
        usuario=usuario_participante,
        experienciaMindfulness='ninguna',
        condicionesSalud='Ninguna'
    )

@pytest.fixture
def investigador(usuario_investigador):
    """Perfil de investigador para tests."""
    return Investigador.objects.create(
        usuario=usuario_investigador,
        experienciaInvestigacion='si',
        areasInteres=['mindfulness', 'psicología']
    )

@pytest.fixture
def programa_borrador(investigador):
    """Programa en estado borrador para tests."""
    return Programa.objects.create(
        nombre='Programa Test',
        descripcion='Descripción del programa test',
        duracion_semanas=8,
        tipo_contexto='crecimiento_personal',
        enfoque_metodologico='MBSR',
        poblacion_objetivo='Adultos',
        creado_por=investigador,
        estado_publicacion=EstadoPublicacion.BORRADOR
    )

@pytest.fixture
def programa_publicado(investigador):
    """Programa publicado para tests."""
    programa = Programa.objects.create(
        nombre='Programa Publicado Test',
        descripcion='Descripción del programa publicado test',
        duracion_semanas=4,
        tipo_contexto='crecimiento_personal',
        enfoque_metodologico='MBSR',
        poblacion_objetivo='Adultos',
        creado_por=investigador,
        estado_publicacion=EstadoPublicacion.PUBLICADO
    )
    return programa

@pytest.fixture
def cuestionario_pre(programa_borrador):
    """Cuestionario pre para tests."""
    return Cuestionario.objects.create(
        programa=programa_borrador,
        momento=MomentoCuestionario.PRE,
        tipo_cuestionario='personalizado',
        titulo='Cuestionario Pre Test',
        descripcion='Descripción del cuestionario pre',
        preguntas=[
            {
                'id': 1,
                'tipo': 'texto',
                'pregunta': '¿Cómo te sientes?',
                'requerida': True
            }
        ]
    )

@pytest.fixture
def cuestionario_post(programa_borrador):
    """Cuestionario post para tests."""
    return Cuestionario.objects.create(
        programa=programa_borrador,
        momento=MomentoCuestionario.POST,
        tipo_cuestionario='personalizado',
        titulo='Cuestionario Post Test',
        descripcion='Descripción del cuestionario post',
        preguntas=[
            {
                'id': 1,
                'tipo': 'texto',
                'pregunta': '¿Cómo te sientes ahora?',
                'requerida': True
            }
        ]
    )

@pytest.fixture
def sesion(programa_borrador):
    """Sesión para tests."""
    return Sesion.objects.create(
        programa=programa_borrador,
        titulo='Sesión Test',
        descripcion='Descripción de la sesión test',
        semana=1,
        duracion_estimada=30,
        tipo_practica='breath',
        tipo_contenido='temporizador',
        contenido_temporizador=10
    )

@pytest.fixture
def authenticated_client_participante(api_client, participante):
    """Cliente autenticado como participante."""
    refresh = RefreshToken.for_user(participante.usuario)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client

@pytest.fixture
def authenticated_client_investigador(api_client, investigador):
    """Cliente autenticado como investigador."""
    refresh = RefreshToken.for_user(investigador.usuario)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client

@pytest.fixture
def authenticated_client_admin(api_client, usuario_admin):
    """Cliente autenticado como admin."""
    refresh = RefreshToken.for_user(usuario_admin)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client

# Configuración automática para acceso a DB
@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """Habilita acceso a base de datos para todos los tests."""
    pass 