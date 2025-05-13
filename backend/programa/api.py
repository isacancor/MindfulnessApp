from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Programa, EstadoPublicacion, ProgramaParticipante, EstadoPrograma
from .serializers import ProgramaSerializer
from sesion.models import Sesion, EtiquetaPractica, TipoContenido
from django.shortcuts import get_object_or_404
from cuestionario.models import Cuestionario
from django.utils import timezone

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_list_create(request):
    if request.method == 'GET':
        if request.user.is_investigador():
            programas = Programa.objects.filter(creado_por=request.user)
        else:
            print("participante")
            programas = Programa.objects.filter(estado_publicacion=EstadoPublicacion.PUBLICADO)
            print(programas)
            print("============================")
        serializer = ProgramaSerializer(programas, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_investigador():
            return Response(
                {'error': 'Solo los investigadores pueden crear programas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # usuario investigador
        investigador = request.user
        if not investigador:
            return Response(
                {'error': 'El usuario no tiene un perfil de investigador configurado'},
                status=status.HTTP_400_BAD_REQUEST
            )
                
        serializer = ProgramaSerializer(data=request.data)
        if serializer.is_valid():
            programa = serializer.save(creado_por=investigador)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def programa_detail(request, pk):
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProgramaSerializer(programa)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Verificar que el usuario es el investigador
        if programa.creado_por != request.user:
            return Response(
                {'error': 'Solo el investigador puede modificar el programa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Si se intenta publicar, verificar que tenga ambos cuestionarios
        if request.data.get('estado') == 'publicado':
            tiene_pre = Cuestionario.objects.filter(programa=programa, tipo='pre').exists()
            tiene_post = Cuestionario.objects.filter(programa=programa, tipo='post').exists()
            
            if not (tiene_pre and tiene_post):
                return Response(
                    {'error': 'No se puede publicar el programa sin tener ambos cuestionarios (pre y post)'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
            return Response(
                {'error': 'No se puede modificar un programa publicado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ProgramaSerializer(programa, data=request.data)
        if serializer.is_valid():
            programa_actualizado = serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
            return Response(
                {'error': 'No se puede eliminar un programa publicado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar que el usuario es el investigador
        if programa.creado_por != request.user:
            return Response(
                {'error': 'Solo el investigador puede eliminar el programa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            programa.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {'error': 'No se pudo eliminar el programa'},
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_publicar(request, pk):
    programa = get_object_or_404(Programa, pk=pk)
    
    # Verificar que el usuario es el investigador del programa
    if programa.creado_por != request.user:
        return Response(
            {"error": "No tienes permiso para publicar este programa"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        programa.publicar()
        return Response({"message": "Programa publicado exitosamente"})
    except ValueError as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {"error": "Ha ocurrido un error al publicar el programa"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mi_programa(request):
    if not request.user.is_participante():
        return Response(
            {'error': 'Solo los participantes pueden acceder a esta vista'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        inscripcion = ProgramaParticipante.objects.get(
            participante=request.user,
            estado_programa=EstadoPrograma.EN_PROGRESO
        )
        programa = inscripcion.programa
        
        # Verificar si ha respondido el cuestionario pre
        cuestionario_pre_respondido = False
        if programa.cuestionario_pre:
            from cuestionario.models import RespuestaCuestionario
            cuestionario_pre_respondido = RespuestaCuestionario.objects.filter(
                cuestionario=programa.cuestionario_pre,
                usuario=request.user
            ).exists()
        
        # Verificar si ha respondido el cuestionario post
        cuestionario_post_respondido = False
        if programa.cuestionario_post:
            from cuestionario.models import RespuestaCuestionario
            cuestionario_post_respondido = RespuestaCuestionario.objects.filter(
                cuestionario=programa.cuestionario_post,
                usuario=request.user
            ).exists()
        
        serializer = ProgramaSerializer(programa, context={'request': request})
        response_data = serializer.data
        response_data['cuestionario_pre_respondido'] = cuestionario_pre_respondido
        response_data['cuestionario_post_respondido'] = cuestionario_post_respondido
        
        return Response(response_data)
    except ProgramaParticipante.DoesNotExist:
        return Response(None)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_enrolar(request, pk):
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not request.user.is_participante():
        return Response(
            {'error': 'Solo los participantes pueden enrolarse en programas'},
            status=status.HTTP_403_FORBIDDEN
        )

    if programa.estado_publicacion != EstadoPublicacion.PUBLICADO:
        return Response(
            {'error': 'No se puede enrolar en un programa que no está publicado o está finalizado'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar si el participante ya está enrolado en algún programa en progreso
    if ProgramaParticipante.objects.filter(participante=request.user, estado_programa=EstadoPrograma.EN_PROGRESO).exists():
        return Response(
            {'error': 'Ya estás enrolado en un programa en progreso'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Crear la inscripción
        inscripcion = ProgramaParticipante.objects.create(
            programa=programa,
            participante=request.user,
            estado_programa=EstadoPrograma.EN_PROGRESO
        )
        inscripcion.calcular_fecha_fin()

        # Agregar al participante al programa
        programa.participantes.add(request.user)
        
        return Response({'status': 'Enrolamiento exitoso'})
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_completar(request, pk):
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not request.user.is_participante():
        return Response(
            {'error': 'Solo los participantes pueden completar programas'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        inscripcion = ProgramaParticipante.objects.get(
            programa=programa,
            participante=request.user,
            estado_programa=EstadoPrograma.EN_PROGRESO
        )
    except ProgramaParticipante.DoesNotExist:
        return Response(
            {'error': 'No estás enrolado en este programa o ya está completado'},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        inscripcion.completar_programa()
        return Response({
            'status': 'Programa completado exitosamente',
            'estado_programa': inscripcion.estado_programa
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def mis_programas_completados(request):
    """
    Obtiene la lista de programas completados por el usuario actual.
    """
    if not request.user.is_participante():
        return Response(
            {'error': 'Solo los participantes pueden acceder a esta vista'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        # Obtener todos los programas en los que el usuario está inscrito y están completados
        programas_completados = ProgramaParticipante.objects.filter(
            participante=request.user,
            estado_programa=EstadoPrograma.COMPLETADO
        ).select_related('programa')

        # Serializar los programas
        programas = [inscripcion.programa for inscripcion in programas_completados]
        serializer = ProgramaSerializer(programas, many=True, context={'request': request})

        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': f'Error al obtener programas completados: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_finalizar(request, pk):
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Verificar que el usuario es el investigador del programa
    if programa.creado_por != request.user:
        return Response(
            {"error": "No tienes permiso para finalizar este programa"},
            status=status.HTTP_403_FORBIDDEN
        )

    # Verificar que el programa está publicado
    if programa.estado_publicacion != EstadoPublicacion.PUBLICADO:
        return Response(
            {"error": "Solo se pueden finalizar programas que estén publicados"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        programa.estado_publicacion = EstadoPublicacion.FINALIZADO
        programa.fecha_finalizacion = timezone.now()
        programa.save()
        return Response({"message": "Programa finalizado exitosamente"})
    except Exception as e:
        return Response(
            {"error": "Ha ocurrido un error al finalizar el programa"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def programa_inscripciones(request, pk):
    """
    Obtiene la lista de inscripciones de un programa.
    """
    try:
        programa = Programa.objects.get(pk=pk)
        
        # Verificar permisos: solo el creador del programa puede ver las inscripciones
        if programa.creado_por != request.user:
            return Response(
                {'error': 'No tienes permiso para ver las inscripciones de este programa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener todas las inscripciones del programa
        inscripciones = ProgramaParticipante.objects.filter(
            programa=programa
        ).select_related('participante')
        
        # Crear una lista de datos de inscripción
        inscripciones_data = []
        for inscripcion in inscripciones:
            inscripciones_data.append({
                'id': inscripcion.id,
                'participante': inscripcion.participante.id,
                'fecha_inicio': inscripcion.fecha_inicio,
                'fecha_fin': inscripcion.fecha_fin,
                'estado_programa': inscripcion.estado_programa
            })
        
        return Response(inscripciones_data)
    except Programa.DoesNotExist:
        return Response(
            {'error': 'El programa no existe'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': f'Error al obtener inscripciones: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
