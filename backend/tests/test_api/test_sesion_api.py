import pytest
from django.urls import reverse
from rest_framework import status
from sesion.models import Sesion, DiarioSesion
from programa.models import InscripcionPrograma, Programa
from config.enums import EstadoInscripcion, EtiquetaPractica, TipoContenido, EstadoPublicacion
from django.core.files.uploadedfile import SimpleUploadedFile

@pytest.mark.django_db
class TestSesionAPI:
    """Tests para la API de sesiones."""

    def test_sesion_list_authenticated_investigador(self, authenticated_client_investigador, programa_borrador, sesion):
        """Test listar sesiones como investigador autenticado."""
        url = '/api/sesiones/'
        response = authenticated_client_investigador.get(url, {'programa': programa_borrador.id})
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_sesion_list_unauthenticated(self, api_client):
        """Test listar sesiones sin autenticación."""
        url = '/api/sesiones/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_sesion_create_success_investigador(self, authenticated_client_investigador, programa_borrador, investigador):
        """Test crear sesión exitosamente como investigador."""
        data = {
            'programa': programa_borrador.id,
            'titulo': 'Nueva Sesión Test',
            'descripcion': 'Descripción de la nueva sesión',
            'semana': 2,
            'duracion_estimada': 25,
            'tipo_practica': 'breath',
            'tipo_contenido': 'temporizador',
            'contenido_temporizador': 15
        }
        
        url = '/api/sesiones/'
        response = authenticated_client_investigador.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['titulo'] == 'Nueva Sesión Test'
        assert Sesion.objects.filter(titulo='Nueva Sesión Test').exists()

    def test_sesion_create_forbidden_participante(self, authenticated_client_participante, programa_borrador):
        """Test crear sesión como participante (debe fallar)."""
        data = {
            'programa': programa_borrador.id,
            'titulo': 'Sesión No Permitida',
            'semana': 3
        }
        
        url = '/api/sesiones/'
        response = authenticated_client_participante.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_sesion_create_programa_publicado(self, authenticated_client_investigador, programa_publicado):
        """Test crear sesión en programa publicado (debe fallar)."""
        # Asegurar que el programa esté realmente publicado
        Programa.objects.filter(id=programa_publicado.id).update(
            estado_publicacion=EstadoPublicacion.PUBLICADO
        )
        programa_publicado.refresh_from_db()
        
        data = {
            'programa': programa_publicado.id,
            'titulo': 'Sesión en Programa Publicado',
            'semana': 1
        }
        
        url = '/api/sesiones/'
        response = authenticated_client_investigador.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_sesion_create_semana_duplicada(self, authenticated_client_investigador, programa_borrador, sesion):
        """Test crear sesión con semana duplicada."""
        data = {
            'programa': programa_borrador.id,
            'titulo': 'Sesión Duplicada',
            'semana': sesion.semana  # Misma semana que la sesión existente
        }
        
        url = '/api/sesiones/'
        response = authenticated_client_investigador.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_sesion_detail_get_success(self, authenticated_client_investigador, sesion):
        """Test obtener detalle de sesión exitosamente."""
        url = reverse('sesion-detail', kwargs={'pk': sesion.pk})
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['titulo'] == sesion.titulo

    def test_sesion_detail_update_success(self, authenticated_client_investigador, sesion):
        """Test actualizar sesión exitosamente."""
        data = {
            'titulo': 'Título Actualizado',
            'descripcion': 'Descripción actualizada'
        }
        
        url = reverse('sesion-detail', kwargs={'pk': sesion.pk})
        response = authenticated_client_investigador.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        sesion.refresh_from_db()
        assert sesion.titulo == 'Título Actualizado'

    def test_sesion_detail_update_forbidden_participante(self, authenticated_client_participante, sesion):
        """Test actualizar sesión como participante (debe fallar)."""
        data = {
            'titulo': 'No Permitido'
        }
        
        url = reverse('sesion-detail', kwargs={'pk': sesion.pk})
        response = authenticated_client_participante.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_sesion_detail_delete_success(self, authenticated_client_investigador, programa_borrador):
        """Test eliminar sesión exitosamente."""
        sesion_temp = Sesion.objects.create(
            programa=programa_borrador,
            titulo='Sesión a Eliminar',
            semana=5,
            tipo_practica='breath',
            tipo_contenido='temporizador'
        )
        
        url = reverse('sesion-detail', kwargs={'pk': sesion_temp.pk})
        response = authenticated_client_investigador.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Sesion.objects.filter(pk=sesion_temp.pk).exists()

    def test_tipos_practica_endpoint(self, authenticated_client_investigador):
        """Test endpoint de tipos de práctica."""
        url = reverse('tipos-practica')
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) > 0

    def test_tipos_contenido_endpoint(self, authenticated_client_investigador):
        """Test endpoint de tipos de contenido."""
        url = reverse('tipos-contenido')
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) > 0

    def test_tipos_escala_endpoint(self, authenticated_client_investigador):
        """Test endpoint de tipos de escala."""
        url = reverse('tipos-escala')
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) > 0

@pytest.mark.django_db
class TestDiarioSesionAPI:
    """Tests para la API de diarios de sesión."""

    def test_diario_list_authenticated_participante(self, authenticated_client_participante, participante):
        """Test listar diarios como participante autenticado."""
        url = '/api/sesiones/diario/'
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_diario_list_empty_investigador(self, authenticated_client_investigador):
        """Test listar diarios como investigador (debe estar vacío)."""
        url = reverse('diario-sesion-list-create')
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_diario_create_success_participante(self, authenticated_client_participante, sesion, participante, programa_borrador):
        """Test crear diario como participante exitosamente."""
        # Crear inscripción para que el participante pueda crear diarios
        InscripcionPrograma.objects.create(
            programa=programa_borrador,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        data = {
            'sesion_id': sesion.id,
            'valoracion': 4.5,
            'comentario': 'Excelente sesión de práctica'
        }
        
        url = '/api/sesiones/diario/'
        response = authenticated_client_participante.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['valoracion'] == 4.5
        assert DiarioSesion.objects.filter(participante=participante, sesion=sesion).exists()

    def test_diario_create_forbidden_investigador(self, authenticated_client_investigador, sesion):
        """Test crear diario como investigador (debe fallar)."""
        data = {
            'sesion': sesion.id,
            'valoracion': 4.0,
            'comentario': 'No debería funcionar'
        }
        
        url = '/api/sesiones/diario/'
        response = authenticated_client_investigador.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_diario_detail_get_success(self, authenticated_client_participante, sesion, participante, programa_borrador):
        """Test obtener detalle de diario exitosamente."""
        # Crear inscripción y diario
        InscripcionPrograma.objects.create(
            programa=programa_borrador,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        diario = DiarioSesion.objects.create(
            participante=participante,
            sesion=sesion,
            valoracion=3.5,
            comentario='Diario de prueba'
        )
        
        url = reverse('diario-sesion-detail', kwargs={'pk': diario.pk})
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['valoracion'] == 3.5

    def test_diario_detail_update_success(self, authenticated_client_participante, sesion, participante, programa_borrador):
        """Test actualizar diario exitosamente."""
        # Crear inscripción y diario
        InscripcionPrograma.objects.create(
            programa=programa_borrador,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        diario = DiarioSesion.objects.create(
            participante=participante,
            sesion=sesion,
            valoracion=3.0,
            comentario='Diario original'
        )
        
        data = {
            'valoracion': 4.0,
            'comentario': 'Diario actualizado'
        }
        
        url = reverse('diario-sesion-detail', kwargs={'pk': diario.pk})
        response = authenticated_client_participante.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        diario.refresh_from_db()
        assert diario.valoracion == 4.0
        assert diario.comentario == 'Diario actualizado'

    def test_diario_detail_delete_success(self, authenticated_client_participante, sesion, participante, programa_borrador):
        """Test eliminar diario exitosamente."""
        # Crear inscripción y diario
        InscripcionPrograma.objects.create(
            programa=programa_borrador,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        diario = DiarioSesion.objects.create(
            participante=participante,
            sesion=sesion,
            valoracion=2.5,
            comentario='A eliminar'
        )
        
        url = reverse('diario-sesion-detail', kwargs={'pk': diario.pk})
        response = authenticated_client_participante.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not DiarioSesion.objects.filter(pk=diario.pk).exists()

    def test_diario_info_exists(self, authenticated_client_participante, sesion, participante, programa_borrador):
        """Test obtener información de diario existente."""
        # Crear inscripción y diario
        InscripcionPrograma.objects.create(
            programa=programa_borrador,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        diario = DiarioSesion.objects.create(
            participante=participante,
            sesion=sesion,
            valoracion=4.0,
            comentario='Información del diario'
        )
        
        url = reverse('diario-info', kwargs={'sesion_id': sesion.id})
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['valoracion'] == 4.0

    def test_diario_info_not_exists(self, authenticated_client_participante, sesion):
        """Test obtener información de diario que no existe."""
        url = reverse('diario-info', kwargs={'sesion_id': sesion.id})
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data is None

    def test_diario_info_forbidden_investigador(self, authenticated_client_investigador, sesion):
        """Test obtener información de diario como investigador."""
        url = reverse('diario-info', kwargs={'sesion_id': sesion.id})
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_diario_unauthenticated_endpoints(self, api_client):
        """Test endpoints de diarios sin autenticación."""
        url = '/api/sesiones/diario/'
        response = api_client.get(url)
        urls = [
            reverse('diario-sesion-list-create'),
            reverse('diario-info', kwargs={'sesion_id': 1})
        ]
        
        for url in urls:
            response = api_client.get(url)
            assert response.status_code == status.HTTP_401_UNAUTHORIZED 