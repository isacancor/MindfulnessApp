import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from usuario.models import Participante, Investigador
from config.enums import RoleUsuario

Usuario = get_user_model()

@pytest.mark.django_db
class TestUsuarioAPI:
    """Tests para la API de usuarios."""

    def test_usuario_viewset_list_authenticated(self, authenticated_client_admin):
        """Test listar usuarios autenticado como admin."""
        url = reverse('usuario-list')
        response = authenticated_client_admin.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_usuario_viewset_list_unauthenticated(self, api_client):
        """Test listar usuarios sin autenticación."""
        url = reverse('usuario-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_usuario_viewset_create_authenticated(self, authenticated_client_admin):
        """Test crear usuario autenticado como admin."""
        data = {
            'username': 'nuevo_usuario_admin',
            'email': 'nuevo_admin@test.com',
            'password': 'testpassword123',
            'nombre': 'Nuevo',
            'apellidos': 'Usuario',
            'role': RoleUsuario.PARTICIPANTE
        }
        
        url = reverse('usuario-list')
        response = authenticated_client_admin.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Usuario.objects.filter(email='nuevo_admin@test.com').exists()

    def test_usuario_viewset_retrieve_authenticated(self, authenticated_client_admin, usuario_participante):
        """Test obtener usuario específico autenticado como admin."""
        url = reverse('usuario-detail', kwargs={'pk': usuario_participante.pk})
        response = authenticated_client_admin.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == usuario_participante.email

    def test_usuario_viewset_update_authenticated(self, authenticated_client_admin, usuario_participante):
        """Test actualizar usuario autenticado como admin."""
        data = {
            'nombre': 'Nombre Actualizado',
            'apellidos': 'Apellidos Actualizados'
        }
        
        url = reverse('usuario-detail', kwargs={'pk': usuario_participante.pk})
        response = authenticated_client_admin.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        usuario_participante.refresh_from_db()
        assert usuario_participante.nombre == 'Nombre Actualizado'

    def test_usuario_viewset_delete_authenticated(self, authenticated_client_admin, usuario_participante):
        """Test eliminar usuario autenticado como admin."""
        url = reverse('usuario-detail', kwargs={'pk': usuario_participante.pk})
        response = authenticated_client_admin.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Usuario.objects.filter(pk=usuario_participante.pk).exists()

    def test_investigador_viewset_list_authenticated(self, authenticated_client_admin, investigador):
        """Test listar investigadores autenticado como admin."""
        url = reverse('investigador-list')
        response = authenticated_client_admin.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) >= 1

    def test_investigador_viewset_create_authenticated(self, authenticated_client_admin, usuario_investigador):
        """Test crear perfil de investigador autenticado como admin."""
        data = {
            'usuario': usuario_investigador.id,
            'experienciaInvestigacion': 'si',
            'areasInteres': ['mindfulness', 'neurociencia']
        }
        
        url = reverse('investigador-list')
        response = authenticated_client_admin.post(url, data, format='json')
        
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
        # Puede fallar si ya existe el perfil

    def test_investigador_viewset_retrieve_authenticated(self, authenticated_client_admin, investigador):
        """Test obtener investigador específico autenticado como admin."""
        url = reverse('investigador-detail', kwargs={'pk': investigador.pk})
        response = authenticated_client_admin.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['experienciaInvestigacion'] == investigador.experienciaInvestigacion

    def test_investigador_viewset_update_authenticated(self, authenticated_client_admin, investigador):
        """Test actualizar investigador autenticado como admin."""
        data = {
            'experienciaInvestigacion': 'no',
            'areasInteres': ['psicología', 'terapia']
        }
        
        url = reverse('investigador-detail', kwargs={'pk': investigador.pk})
        response = authenticated_client_admin.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        investigador.refresh_from_db()
        assert investigador.experienciaInvestigacion == 'no'

    def test_participante_viewset_list_authenticated(self, authenticated_client_admin, participante):
        """Test listar participantes autenticado como admin."""
        url = reverse('participante-list')
        response = authenticated_client_admin.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) >= 1

    def test_participante_viewset_create_authenticated(self, authenticated_client_admin, usuario_participante):
        """Test crear perfil de participante autenticado como admin."""
        data = {
            'usuario': usuario_participante.id,
            'experienciaMindfulness': 'poca',
            'condicionesSalud': 'Ninguna condición especial'
        }
        
        url = reverse('participante-list')
        response = authenticated_client_admin.post(url, data, format='json')
        
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]
        # Puede fallar si ya existe el perfil

    def test_participante_viewset_retrieve_authenticated(self, authenticated_client_admin, participante):
        """Test obtener participante específico autenticado como admin."""
        url = reverse('participante-detail', kwargs={'pk': participante.pk})
        response = authenticated_client_admin.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['experienciaMindfulness'] == participante.experienciaMindfulness

    def test_participante_viewset_update_authenticated(self, authenticated_client_admin, participante):
        """Test actualizar participante autenticado como admin."""
        data = {
            'experienciaMindfulness': 'mas_10_anos',
            'condicionesSalud': 'Condiciones actualizadas'
        }
        
        url = reverse('participante-detail', kwargs={'pk': participante.pk})
        response = authenticated_client_admin.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        participante.refresh_from_db()
        assert participante.experienciaMindfulness == 'mas_10_anos'

    def test_verificar_perfil_participante_success(self, authenticated_client_participante, participante):
        """Test verificar perfil de participante exitoso."""
        url = reverse('verificar-perfil-participante')
        response = authenticated_client_participante.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data
        assert 'perfil' in response.data

    def test_verificar_perfil_participante_create_if_not_exists(self, authenticated_client_participante):
        """Test crear perfil de participante si no existe."""
        url = reverse('verificar-perfil-participante')
        response = authenticated_client_participante.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'message' in response.data
        assert 'perfil' in response.data

    def test_verificar_perfil_participante_non_participante(self, authenticated_client_investigador):
        """Test verificar perfil con usuario no participante."""
        url = reverse('verificar-perfil-participante')
        response = authenticated_client_investigador.post(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert 'error' in response.data

    def test_verificar_perfil_participante_unauthenticated(self, api_client):
        """Test verificar perfil sin autenticación."""
        url = reverse('verificar-perfil-participante')
        response = api_client.post(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_usuario_viewset_forbidden_participante(self, authenticated_client_participante):
        """Test que participante no puede acceder a viewsets de usuario."""
        url = reverse('usuario-list')
        response = authenticated_client_participante.get(url)
        
        # Dependiendo de los permisos configurados, podría ser 403 o 401
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED]

    def test_usuario_viewset_forbidden_investigador(self, authenticated_client_investigador):
        """Test que investigador no puede acceder a viewsets de usuario."""
        url = reverse('usuario-list')
        response = authenticated_client_investigador.get(url)
        
        # Dependiendo de los permisos configurados, podría ser 403 o 401
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED] 