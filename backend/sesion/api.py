from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Sesion, DiarioRespuesta, EtiquetaPractica, TipoContenido
from .serializers import (
    SesionSerializer, 
    SesionDetalleSerializer, 
    DiarioRespuestaSerializer,
    EtiquetaPracticaSerializer,
    TipoContenidoSerializer
)
from programa.models import Programa, ProgramaParticipante, EstadoPublicacion
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

def validate_url(url):
    if not url:
        return False
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    validator = URLValidator()
    try:
        validator(url)
        return True
    except ValidationError:
        return False

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def sesion_list_create(request):
    if request.method == 'GET':
        queryset = Sesion.objects.all()
        
        # Filtrar por programa si se proporciona el ID
        programa_id = request.query_params.get('programa')
        if programa_id:
            try:
                programa = Programa.objects.get(id=programa_id)
                queryset = queryset.filter(programa=programa)
                
                # Si el usuario es participante, mostrar solo sesiones disponibles
                if hasattr(request.user, 'participante'):
                    inscripciones = ProgramaParticipante.objects.filter(
                        participante=request.user.participante,
                        activo=True,
                        programa=programa
                    )
                    
                    # Filtrar por semanas disponibles según la fecha de inscripción
                    ahora = timezone.now()
                    sesiones_disponibles = []
                    
                    for sesion in queryset:
                        for inscripcion in inscripciones:
                            fecha_inicio_semana = inscripcion.fecha_inicio + timezone.timedelta(weeks=sesion.semana-1)
                            fecha_fin_semana = fecha_inicio_semana + timezone.timedelta(weeks=1)
                            if fecha_inicio_semana <= ahora <= fecha_fin_semana:
                                sesiones_disponibles.append(sesion.id)
                                break
                    
                    if sesiones_disponibles:
                        queryset = queryset.filter(id__in=sesiones_disponibles)
                
                # Si el usuario es investigador, mostrar solo sesiones de sus programas
                elif hasattr(request.user, 'investigador'):
                    if programa.creado_por != request.user:
                        return Response([], status=status.HTTP_200_OK)
            
            except Programa.DoesNotExist:
                return Response([], status=status.HTTP_200_OK)
        
        serializer = SesionSerializer(queryset.order_by('semana'), many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Verificar que el usuario es un investigador
        if not request.user.is_investigador():
            return Response(
                {"error": "Solo los investigadores pueden crear sesiones"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que el programa existe y pertenece al investigador
        programa_id = request.data.get('programa')
        try:
            programa = Programa.objects.get(id=programa_id)
            if programa.creado_por != request.user:
                return Response(
                    {"error": "No tienes permiso para crear sesiones en este programa"},
                    status=status.HTTP_403_FORBIDDEN
                )
            if programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
                return Response(
                    {"error": "No se pueden crear sesiones en un programa publicado"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Programa.DoesNotExist:
            return Response(
                {"error": "El programa especificado no existe"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que no existe una sesión para esa semana
        semana = request.data.get('semana')
        if Sesion.objects.filter(programa=programa, semana=semana).exists():
            return Response(
                {"error": "Ya existe una sesión para esta semana"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar campos según el tipo de contenido
        tipo_contenido = request.data.get('tipo_contenido')
        if tipo_contenido == 'enlace':
            url = request.data.get('contenido_url', '')
            if url and not validate_url(url):
                return Response({'error': 'URL inválida. Debe incluir http:// o https://'}, status=status.HTTP_400_BAD_REQUEST)
        elif tipo_contenido == 'temporizador':
            if not request.data.get('contenido_temporizador'):
                request.data['contenido_temporizador'] = 0
        
        serializer = SesionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def sesion_detail(request, pk):
    try:
        sesion = Sesion.objects.get(pk=pk)
    except Sesion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = SesionDetalleSerializer(sesion)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Verificar que el usuario es un investigador
        if not request.user.is_investigador():
            return Response(
                {"error": "Solo los investigadores pueden modificar sesiones"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que el programa pertenece al investigador
        if sesion.programa.creado_por != request.user:
            return Response(
                {"error": "No tienes permiso para modificar esta sesión"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if sesion.programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
            return Response(
                {"error": "No se pueden modificar sesiones de un programa publicado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = SesionSerializer(sesion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Verificar que el usuario es un investigador
        if not request.user.is_investigador():
            return Response(
                {"error": "Solo los investigadores pueden eliminar sesiones"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que el programa pertenece al investigador
        if sesion.programa.creado_por != request.user:
            return Response(
                {"error": "No tienes permiso para eliminar esta sesión"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if sesion.programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
            return Response(
                {"error": "No se pueden eliminar sesiones de un programa publicado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        sesion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tipos_practica(request):
    """Devuelve los tipos de práctica disponibles."""
    tipos = [{'value': key, 'label': label} for key, label in EtiquetaPractica.choices]
    serializer = EtiquetaPracticaSerializer(tipos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tipos_contenido(request):
    """Devuelve los tipos de contenido disponibles."""
    tipos = [{'value': key, 'label': label} for key, label in TipoContenido.choices]
    serializer = TipoContenidoSerializer(tipos, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def diario_respuesta_list_create(request):
    if request.method == 'GET':
        queryset = DiarioRespuesta.objects.all()
        
        # Si el usuario es un participante, mostrar solo sus propias respuestas
        if hasattr(request.user, 'participante'):
            queryset = queryset.filter(participante=request.user.participante)
        
        # Si el usuario es un investigador, mostrar las respuestas de sus programas
        elif hasattr(request.user, 'investigador'):
            programas = Programa.objects.filter(creado_por=request.user)
            sesiones = Sesion.objects.filter(programa__in=programas)
            queryset = queryset.filter(sesion__in=sesiones)
            
        # Filtrar por sesión si se proporciona el ID
        sesion_id = request.query_params.get('sesion')
        if sesion_id:
            queryset = queryset.filter(sesion_id=sesion_id)
            
        serializer = DiarioRespuestaSerializer(queryset, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Verificar que el usuario es un participante
        if not hasattr(request.user, 'participante'):
            return Response(
                {"error": "Solo los participantes pueden enviar diarios"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Establecer el participante automáticamente
        data = request.data.copy()
        data['participante'] = request.user.participante.id
        
        # Verificar que la sesión está disponible para el participante
        sesion_id = data.get('sesion')
        if sesion_id:
            sesion = get_object_or_404(Sesion, id=sesion_id)
            if not sesion.esta_disponible_para(request.user.participante):
                return Response(
                    {"error": "Esta sesión no está disponible actualmente"}, 
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = DiarioRespuestaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def diario_respuesta_detail(request, pk):
    try:
        respuesta = DiarioRespuesta.objects.get(pk=pk)
    except DiarioRespuesta.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DiarioRespuestaSerializer(respuesta)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Verificar que el usuario es el participante que creó la respuesta
        if not hasattr(request.user, 'participante') or respuesta.participante != request.user.participante:
            return Response(
                {"error": "No tienes permiso para modificar esta respuesta"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = DiarioRespuestaSerializer(respuesta, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Verificar que el usuario es el participante que creó la respuesta
        if not hasattr(request.user, 'participante') or respuesta.participante != request.user.participante:
            return Response(
                {"error": "No tienes permiso para eliminar esta respuesta"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        respuesta.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
