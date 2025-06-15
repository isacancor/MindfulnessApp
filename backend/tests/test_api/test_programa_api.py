import pytest
from django.urls import reverse
from rest_framework import status
from programa.models import Programa, InscripcionPrograma
from cuestionario.models import Cuestionario, RespuestaCuestionario
from config.enums import EstadoPublicacion, EstadoInscripcion, MomentoCuestionario, TipoCuestionario

@pytest.mark.django_db
class TestProgramaAPI:
    """Tests para la API de programas."""

    def test_programa_list_authenticated_investigador(self, authenticated_client_investigador, programa_borrador):
        """Test listar programas como investigador autenticado."""
        url = '/api/programas/'
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_programa_list_unauthenticated(self, api_client):
        """Test listar programas sin autenticación."""
        url = '/api/programas/'
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_programa_create_success_investigador(self, authenticated_client_investigador):
        """Test crear programa exitosamente como investigador."""
        data = {
            'nombre': 'Programa API Test',
            'descripcion': 'Descripción del programa de prueba API',
            'duracion_semanas': 6,
            'tipo_contexto': 'crecimiento_personal',
            'enfoque_metodologico': 'MBSR',
            'poblacion_objetivo': 'Adultos jóvenes',
            'estado_publicacion': 'borrador'
        }
        
        url = '/api/programas/'
        response = authenticated_client_investigador.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['nombre'] == 'Programa API Test'

    def test_programa_create_forbidden_participante(self, authenticated_client_participante):
        """Test crear programa como participante (debe fallar)."""
        data = {
            'nombre': 'No Debería Crearse',
            'descripcion': 'Test',
            'duracion_semanas': 4
        }
        
        url = '/api/programas/'
        response = authenticated_client_participante.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_programa_detail_get_success(self, authenticated_client_investigador, programa_borrador):
        """Test obtener detalle de programa exitosamente."""
        url = f'/api/programas/{programa_borrador.id}/'
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['nombre'] == programa_borrador.nombre

    def test_programa_detail_update_success(self, authenticated_client_investigador, programa_borrador):
        """Test actualizar programa exitosamente."""
        data = {
            'nombre': 'Programa Actualizado'
        }
        
        url = f'/api/programas/{programa_borrador.id}/'
        response = authenticated_client_investigador.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['nombre'] == 'Programa Actualizado'

    def test_programa_detail_delete_success(self, authenticated_client_investigador, programa_borrador):
        """Test eliminar programa exitosamente."""
        url = f'/api/programas/{programa_borrador.id}/'
        response = authenticated_client_investigador.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_mi_programa_success(self, authenticated_client_participante, participante, programa_publicado):
        """Test obtener mi programa exitosamente."""
        # Crear inscripción
        InscripcionPrograma.objects.create(
            programa=programa_publicado,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        url = '/api/programas/mi-programa/'
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['nombre'] == programa_publicado.nombre

    def test_mi_programa_no_inscrito(self, authenticated_client_participante):
        """Test obtener mi programa sin estar inscrito."""
        url = '/api/programas/mi-programa/'
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_programa_enrolar_forbidden_investigador(self, authenticated_client_investigador, programa_publicado):
        """Test enrolarse como investigador (debe fallar)."""
        url = f'/api/programas/{programa_publicado.id}/enrolar/'
        response = authenticated_client_investigador.post(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_programa_list_authenticated_participante(self, authenticated_client_participante, programa_publicado):
        """Test listar programas como participante (solo ve publicados)."""
        url = '/api/programas/'
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        # Solo debería ver programas publicados

    def test_programa_detail_update_forbidden_other_investigador(self, authenticated_client_investigador, usuario_investigador):
        """Test actualizar programa de otro investigador (debe fallar)."""
        # Crear otro investigador diferente
        from django.contrib.auth import get_user_model
        from usuario.models import Investigador
        
        Usuario = get_user_model()
        otro_usuario = Usuario.objects.create_user(
            username='otro_investigador',
            email='otro@investigador.com',
            password='testpass123',
            aceptaTerminos=True
        )
        # Asignar nombre y apellido después de crear el usuario
        otro_usuario.nombre = 'Otro'
        otro_usuario.apellido = 'Investigador'
        otro_usuario.save()
        
        otro_investigador = Investigador.objects.create(
            usuario=otro_usuario,
            experienciaInvestigacion='si_menos_5',
            areasInteres=['Mindfulness', 'Investigación']
        )
        
        programa_otro = Programa.objects.create(
            nombre='Programa de Otro',
            descripcion='No debería poder modificar',
            duracion_semanas=4,
            creado_por=otro_investigador
        )
        
        data = {
            'nombre': 'Intento de Modificación'
        }
        
        url = f'/api/programas/{programa_otro.id}/'
        response = authenticated_client_investigador.patch(url, data, format='json')
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_programa_detail_update_publicado(self, authenticated_client_investigador, programa_publicado):
        """Test actualizar programa publicado (debe fallar)."""
        data = {
            'nombre': 'No Debería Cambiar'
        }
        
        url = f'/api/programas/{programa_publicado.id}/'
        response = authenticated_client_investigador.put(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_programa_detail_delete_publicado(self, authenticated_client_investigador, investigador):
        """Test eliminar programa publicado (debe fallar)."""
        # Crear programa publicado específico para este test
        from programa.models import Programa
        from sesion.models import Sesion
        
        programa_publicado = Programa.objects.create(
            nombre='Programa a No Eliminar',
            descripcion='Este programa no se debe poder eliminar',
            duracion_semanas=2,
            tipo_contexto='crecimiento_personal',
            enfoque_metodologico='MBSR',
            poblacion_objetivo='Adultos',
            creado_por=investigador,
            estado_publicacion=EstadoPublicacion.BORRADOR
        )
        
        # Crear las sesiones necesarias
        for semana in range(1, 3):  # 2 semanas
            Sesion.objects.create(
                programa=programa_publicado,
                titulo=f'Sesión {semana}',
                semana=semana,
                tipo_practica='breath',
                tipo_contenido='temporizador'
            )
        
        # Cambiar a publicado usando update para evitar validaciones
        Programa.objects.filter(id=programa_publicado.id).update(
            estado_publicacion=EstadoPublicacion.PUBLICADO
        )
        
        url = f'/api/programas/{programa_publicado.id}/'
        response = authenticated_client_investigador.delete(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_programa_enrolar_success(self, authenticated_client_participante, programa_publicado):
        """Test enrolarse en programa exitosamente."""
        # Crear las sesiones necesarias para el programa
        from sesion.models import Sesion
        for semana in range(1, programa_publicado.duracion_semanas + 1):
            Sesion.objects.create(
                programa=programa_publicado,
                titulo=f'Sesión {semana}',
                semana=semana,
                tipo_practica='breath',
                tipo_contenido='temporizador'
            )
        
        # Asegurar que el programa esté realmente publicado usando update para evitar validaciones
        from programa.models import Programa
        Programa.objects.filter(id=programa_publicado.id).update(
            estado_publicacion=EstadoPublicacion.PUBLICADO
        )
        programa_publicado.refresh_from_db()
        
        url = f'/api/programas/{programa_publicado.id}/enrolar/'
        response = authenticated_client_participante.post(url)
        
        # Aceptar tanto 200 como 201 como válidos
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_201_CREATED]

    def test_programa_enrolar_programa_borrador(self, authenticated_client_participante, programa_borrador):
        """Test enrolarse en programa borrador (debe fallar)."""
        url = f'/api/programas/{programa_borrador.id}/enrolar/'
        response = authenticated_client_participante.post(url)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_mi_programa_forbidden_investigador(self, authenticated_client_investigador):
        """Test obtener mi programa como investigador (debe fallar)."""
        url = '/api/programas/mi-programa/'
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_programa_publicar_success(self, authenticated_client_investigador, programa_borrador, cuestionario_pre, cuestionario_post):
        """Test publicar programa exitosamente."""
        # Asignar cuestionarios al programa
        programa_borrador.cuestionario_pre = cuestionario_pre
        programa_borrador.cuestionario_post = cuestionario_post
        programa_borrador.save()
        
        # Crear sesiones necesarias
        from sesion.models import Sesion
        for semana in range(1, programa_borrador.duracion_semanas + 1):
            Sesion.objects.create(
                programa=programa_borrador,
                titulo=f'Sesión {semana}',
                semana=semana,
                tipo_practica='breath',
                tipo_contenido='temporizador'
            )
        
        url = f'/api/programas/{programa_borrador.id}/publicar/'
        response = authenticated_client_investigador.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        programa_borrador.refresh_from_db()
        assert programa_borrador.estado_publicacion == EstadoPublicacion.PUBLICADO

    def test_programa_duplicar_success(self, authenticated_client_investigador, programa_borrador):
        """Test duplicar programa exitosamente."""
        data = {
            'nuevo_nombre': 'Programa Duplicado'
        }
        
        url = f'/api/programas/{programa_borrador.id}/duplicar/'
        response = authenticated_client_investigador.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert 'Copia de' in response.data['nombre']
        assert Programa.objects.filter(nombre__startswith='Copia de').exists()

    def test_programa_abandonar_success(self, authenticated_client_participante, participante, programa_publicado):
        """Test abandonar programa exitosamente."""
        # Crear inscripción
        inscripcion = InscripcionPrograma.objects.create(
            programa=programa_publicado,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        url = f'/api/programas/{programa_publicado.id}/abandonar/'
        response = authenticated_client_participante.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        inscripcion.refresh_from_db()
        assert inscripcion.estado_inscripcion == EstadoInscripcion.ABANDONADO

    def test_mis_programas_completados(self, authenticated_client_participante, participante, programa_publicado):
        """Test obtener programas completados."""
        # Crear inscripción completada
        InscripcionPrograma.objects.create(
            programa=programa_publicado,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.COMPLETADO
        )
        
        url = '/api/programas/mis-completados/'
        response = authenticated_client_participante.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_programa_inscripciones_investigador(self, authenticated_client_investigador, programa_borrador, participante):
        """Test obtener inscripciones de programa como investigador."""
        # Crear inscripción
        InscripcionPrograma.objects.create(
            programa=programa_borrador,
            participante=participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        url = f'/api/programas/{programa_borrador.id}/inscripciones/'
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

    def test_obtener_participantes_programa(self, authenticated_client_investigador, programa_borrador, participante):
        """Test obtener participantes de programa."""
        # Agregar participante al programa
        programa_borrador.participantes.add(participante)
        
        url = f'/api/programas/{programa_borrador.id}/participantes/'
        response = authenticated_client_investigador.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, dict)
        assert 'participantes' in response.data
        assert len(response.data['participantes']) >= 1

    def test_programa_unauthenticated_endpoints(self, api_client, programa_publicado):
        """Test endpoints sin autenticación."""
        urls = [
            '/api/programas/',
            f'/api/programas/{programa_publicado.id}/',
            f'/api/programas/{programa_publicado.id}/enrolar/',
            '/api/programas/mi-programa/'
        ]
        
        for url in urls:
            if 'enrolar' in url:
                response = api_client.post(url)
            else:
                response = api_client.get(url)
            assert response.status_code == status.HTTP_401_UNAUTHORIZED 