from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from .models import Sesion, DiarioSesion, EtiquetaPractica, TipoContenido, Escala
from .serializers import (
    SesionSerializer, 
    SesionDetalleSerializer, 
    DiarioSesionSerializer,
    EtiquetaPracticaSerializer,
    TipoContenidoSerializer,
    EscalaSerializer
)
from programa.models import Programa, ProgramaParticipante, EstadoPublicacion, EstadoPrograma
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import os
from django.conf import settings

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

def validate_video_file(file):
    if not file:
        return True
    return file.name.lower().endswith('.mp4')

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
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
                if request.user.is_participante():
                    inscripciones = ProgramaParticipante.objects.filter(
                        participante=request.user,
                        estado_programa=EstadoPrograma.EN_PROGRESO,
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
                elif request.user.is_investigador():
                    if programa.creado_por != request.user:
                        return Response([], status=status.HTTP_200_OK)
            
            except Programa.DoesNotExist:
                return Response([], status=status.HTTP_200_OK)
        
        serializer = SesionSerializer(queryset.order_by('semana'), many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Validar que el usuario es un investigador
        if not request.user.is_investigador():
            return Response(
                {"error": "Solo los investigadores pueden crear sesiones"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Validar que el programa pertenece al investigador
        programa_id = request.data.get('programa')
        try:
            programa = Programa.objects.get(id=programa_id)
            if programa.creado_por != request.user:
                return Response(
                    {"error": "No tienes permiso para crear sesiones en este programa"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Programa.DoesNotExist:
            return Response(
                {"error": "Programa no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validar que el programa no está publicado
        if programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
            return Response(
                {"error": "No se pueden crear sesiones en un programa publicado"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar tipo de contenido
        tipo_contenido = request.data.get('tipo_contenido')
        if tipo_contenido == 'enlace':
            url = request.data.get('contenido_url', '')
            if url and not validate_url(url):
                return Response({'error': 'URL inválida. Debe incluir http:// o https://'}, status=status.HTTP_400_BAD_REQUEST)
        elif tipo_contenido == 'temporizador':
            if not request.data.get('contenido_temporizador'):
                request.data['contenido_temporizador'] = 0
        elif tipo_contenido == 'video':
            video_file = request.FILES.get('contenido_video')
            if video_file and not validate_video_file(video_file):
                return Response({'error': 'Solo se permiten archivos de video en formato MP4'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = SesionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def sesion_detail(request, pk):
    try:
        sesion = get_object_or_404(Sesion, pk=pk)
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

        # Validar tipo de contenido
        tipo_contenido = request.data.get('tipo_contenido')
        if tipo_contenido == 'enlace':
            url = request.data.get('contenido_url', '')
            if url and not validate_url(url):
                return Response({'error': 'URL inválida. Debe incluir http:// o https://'}, status=status.HTTP_400_BAD_REQUEST)
        elif tipo_contenido == 'temporizador':
            if not request.data.get('contenido_temporizador'):
                request.data['contenido_temporizador'] = 0
        elif tipo_contenido == 'video':
            video_file = request.FILES.get('contenido_video')
            if video_file and not validate_video_file(video_file):
                return Response({'error': 'Solo se permiten archivos de video en formato MP4'}, status=status.HTTP_400_BAD_REQUEST)

        # Limpiar contenido anterior si se cambió el tipo de contenido
        if request.data.get('limpiar_contenido') == 'true':
            tipo_anterior = request.data.get('tipo_contenido_anterior')
            
            # Eliminar archivos físicos si existen
            if tipo_anterior == 'audio' and sesion.contenido_audio:
                try:
                    os.remove(os.path.join(settings.MEDIA_ROOT, str(sesion.contenido_audio)))
                except:
                    pass
                sesion.contenido_audio = None
            
            elif tipo_anterior == 'video' and sesion.contenido_video:
                try:
                    os.remove(os.path.join(settings.MEDIA_ROOT, str(sesion.contenido_video)))
                except:
                    pass
                sesion.contenido_video = None
            
            # Limpiar campos en la base de datos
            if tipo_anterior == 'temporizador':
                sesion.contenido_temporizador = None
            elif tipo_anterior == 'enlace':
                sesion.contenido_url = None
            
            sesion.save()
        
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
        
        # Eliminar archivos físicos si existen
        if sesion.contenido_audio:
            try:
                os.remove(os.path.join(settings.MEDIA_ROOT, str(sesion.contenido_audio)))
            except:
                pass
        
        if sesion.contenido_video:
            try:
                os.remove(os.path.join(settings.MEDIA_ROOT, str(sesion.contenido_video)))
            except:
                pass
        
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

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tipos_escala(request):
    tipos = [{'value': choice[0], 'label': choice[1]} for choice in Escala.choices]
    return Response(tipos)

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def diario_sesion_list_create(request):
    if request.method == 'GET':
        # Verificar que el usuario es un participante
        if not request.user.is_participante():
            return Response(
                {"error": "Solo los participantes pueden ver sus diarios"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Filtrar por participante
        queryset = DiarioSesion.objects.filter(participante=request.user)
        
        # Filtrar por sesión si se proporciona
        sesion_id = request.query_params.get('sesion')
        if sesion_id:
            queryset = queryset.filter(sesion_id=sesion_id)
        
        serializer = DiarioSesionSerializer(queryset, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Verificar que el usuario es un participante
        if not request.user.is_participante():
            return Response(
                {"error": "Solo los participantes pueden enviar diarios"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que la sesión existe
        sesion_id = request.data.get('sesion_id')
        if not sesion_id:
            return Response(
                {"error": "Se requiere el ID de la sesión"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            sesion = Sesion.objects.get(id=sesion_id)
        except Sesion.DoesNotExist:
            return Response(
                {"error": "La sesión no existe"}, 
                status=status.HTTP_404_NOT_FOUND
            )
            
        # Verificar si ya existe un diario para esta sesión
        if DiarioSesion.objects.filter(participante=request.user, sesion=sesion).exists():
            return Response(
                {"error": "Ya has completado el diario para esta sesión"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el participante está inscrito en el programa
        inscripcion = ProgramaParticipante.objects.filter(
            participante=request.user,
            programa=sesion.programa,
            estado_programa=EstadoPrograma.EN_PROGRESO,
        ).first()
        
        if not inscripcion:
            return Response(
                {"error": "No estás inscrito en este programa"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Crear el serializador con el contexto necesario
        serializer = DiarioSesionSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def diario_sesion_detail(request, pk):
    try:
        diario = DiarioSesion.objects.get(pk=pk)
    except DiarioSesion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DiarioSesionSerializer(diario)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Verificar que el usuario es el participante que creó el diario
        if not request.user.is_participante() or diario.participante != request.user:
            return Response(
                {"error": "No tienes permiso para modificar este diario"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = DiarioSesionSerializer(diario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        # Verificar que el usuario es el participante que creó el diario
        if not request.user.is_participante() or diario.participante != request.user:
            return Response(
                {"error": "No tienes permiso para eliminar este diario"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        diario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def diario_info(request, sesion_id):
    try:
        sesion = get_object_or_404(Sesion, pk=sesion_id)
    except Sesion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Verificar que el usuario es un participante
    if not request.user.is_participante():
        return Response(
            {"error": "Solo los participantes pueden ver sus diarios"}, 
            status=status.HTTP_403_FORBIDDEN
        )

    # Buscar el diario para esta sesión
    try:
        diario = DiarioSesion.objects.get(
            participante=request.user,
            sesion=sesion
        )
        serializer = DiarioSesionSerializer(diario)
        return Response(serializer.data)
    except DiarioSesion.DoesNotExist:
        return Response(None, status=status.HTTP_200_OK)
