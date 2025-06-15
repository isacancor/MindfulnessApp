"""
Utilidades helper para los tests.
"""
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from usuario.models import Investigador, Participante
from programa.models import Programa
from config.enums import RoleUsuario, EstadoPublicacion

Usuario = get_user_model()

def create_test_user(role=RoleUsuario.PARTICIPANTE, username=None, email=None):
    """
    Crea un usuario de prueba con el rol especificado.
    """
    if not username:
        username = f'test_user_{role}'
    if not email:
        email = f'test_{role}@example.com'
    
    user = Usuario.objects.create_user(
        username=username,
        email=email,
        password='testpassword123',
        nombre='Test',
        apellidos='User',
        role=role
    )
    return user

def create_authenticated_client(user):
    """
    Crea un cliente autenticado para el usuario especificado.
    """
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client

def create_test_programa(investigador, **kwargs):
    """
    Crea un programa de prueba.
    """
    defaults = {
        'nombre': 'Programa Test',
        'descripcion': 'Descripción de prueba',
        'duracion_semanas': 4,
        'tipo_contexto': 'crecimiento_personal',
        'enfoque_metodologico': 'mbsr',
        'poblacion_objetivo': 'Adultos',
        'creado_por': investigador,
        'estado_publicacion': EstadoPublicacion.BORRADOR
    }
    defaults.update(kwargs)
    return Programa.objects.create(**defaults)

def assert_api_response_success(response, status_code=200):
    """
    Verifica que la respuesta de la API sea exitosa.
    """
    assert response.status_code == status_code
    if hasattr(response, 'data'):
        assert response.data is not None

def assert_api_response_error(response, status_code=400):
    """
    Verifica que la respuesta de la API contenga un error.
    """
    assert response.status_code == status_code
    if hasattr(response, 'data'):
        assert 'error' in response.data or 'detail' in response.data

def get_api_url(endpoint, *args):
    """
    Construye una URL de API con parámetros.
    """
    if args:
        return f'/api/{endpoint}/{"/".join(str(arg) for arg in args)}/'
    return f'/api/{endpoint}/'

class TestDataMixin:
    """
    Mixin que proporciona datos de prueba comunes.
    """
    
    @classmethod
    def create_test_usuarios(cls):
        """Crea usuarios de prueba para diferentes roles."""
        return {
            'participante': create_test_user(RoleUsuario.PARTICIPANTE),
            'investigador': create_test_user(RoleUsuario.INVESTIGADOR),
            'admin': create_test_user(RoleUsuario.ADMIN)
        }
    
    @classmethod
    def create_test_programas(cls, investigador):
        """Crea programas de prueba."""
        borrador = create_test_programa(
            investigador, 
            nombre='Programa Borrador',
            estado_publicacion=EstadoPublicacion.BORRADOR
        )
        
        publicado = create_test_programa(
            investigador,
            nombre='Programa Publicado', 
            estado_publicacion=EstadoPublicacion.PUBLICADO
        )
        
        return {'borrador': borrador, 'publicado': publicado} 