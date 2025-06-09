from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from ..models import Programa, EstadoPublicacion, InscripcionPrograma, EstadoInscripcion, Participante
from ..serializers import ProgramaSerializer, ParticipanteSerializer
from django.shortcuts import get_object_or_404
from cuestionario.models import Cuestionario, RespuestaCuestionario
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from usuario.permissions import IsInvestigador


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_list_create(request):
    if request.method == 'GET':
        if request.user.is_investigador():
            programas = Programa.objects.filter(creado_por=request.user.perfil_investigador)
        else:
            programas = Programa.objects.filter(estado_publicacion=EstadoPublicacion.PUBLICADO)
        serializer = ProgramaSerializer(programas, many=True, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_investigador():
            return Response(
                {'error': 'Solo los investigadores pueden crear programas'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ProgramaSerializer(data=request.data)
        if serializer.is_valid():
            programa = serializer.save(creado_por=request.user.perfil_investigador)
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
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {'error': 'Solo el investigador puede modificar el programa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.data.get('estado') == 'publicado':
            tiene_pre = Cuestionario.objects.filter(programa=programa, momento='pre').exists()
            tiene_post = Cuestionario.objects.filter(programa=programa, momento='post').exists()
            
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
        
        if programa.creado_por != request.user.perfil_investigador:
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mi_programa(request):
    """
    Obtiene el programa actual del participante
    """
    try:
        # Verificar si el usuario es participante
        if not request.user.is_participante():
            return Response(
                {"detail": "El usuario no es un participante"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener el objeto Participante asociado al usuario
        participante = get_object_or_404(Participante, usuario=request.user)
        
        # Buscar la inscripción activa del participante
        try:
            inscripcion = InscripcionPrograma.objects.get(
                participante=participante,
                estado_inscripcion=EstadoInscripcion.EN_PROGRESO
            )
            programa = inscripcion.programa

            # Verificar si ha respondido el cuestionario pre
            cuestionario_pre_respondido = False
            if programa.cuestionario_pre:
                cuestionario_pre_respondido = RespuestaCuestionario.objects.filter(
                    cuestionario=programa.cuestionario_pre,
                    participante=participante
                ).exists()
            
            # Verificar si ha respondido el cuestionario post
            cuestionario_post_respondido = False
            if programa.cuestionario_post:
                cuestionario_post_respondido = RespuestaCuestionario.objects.filter(
                    cuestionario=programa.cuestionario_post,
                    participante=participante
                ).exists()
            
            serializer = ProgramaSerializer(programa, context={'request': request})
            response_data = serializer.data
            response_data['cuestionario_pre_respondido'] = cuestionario_pre_respondido
            response_data['cuestionario_post_respondido'] = cuestionario_post_respondido

            return Response(response_data)
            
        except InscripcionPrograma.DoesNotExist:
            return Response(
                {"detail": "No tienes ningún programa activo"},
                status=status.HTTP_404_NOT_FOUND
            )
            
    except Participante.DoesNotExist:
        return Response(
            {"detail": "No se encontró el perfil de participante"},
            status=status.HTTP_404_NOT_FOUND
        )

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
            {'error': 'No se puede enrolar en un programa que no está publicado'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar si el participante ya está enrolado en algún programa en progreso
    if InscripcionPrograma.objects.filter(
        participante=request.user.perfil_participante,
        estado_inscripcion=EstadoInscripcion.EN_PROGRESO
    ).exists():
        return Response(
            {'error': 'Ya estás enrolado en un programa en progreso'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Crear la inscripción
        inscripcion = InscripcionPrograma.objects.create(
            programa=programa,
            participante=request.user.perfil_participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        inscripcion.calcular_fecha_fin()
        
        # Agregar al participante al programa
        programa.participantes.add(request.user.perfil_participante)
        
        return Response({'status': 'Enrolamiento exitoso'})
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_publicar(request, pk):
    programa = get_object_or_404(Programa, pk=pk)
    
    if programa.creado_por != request.user.perfil_investigador:
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

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_duplicar(request, pk):
    try:
        programa_original = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if programa_original.creado_por != request.user.perfil_investigador:
        return Response(
            {"error": "No tienes permiso para duplicar este programa"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        programa_duplicado = Programa.objects.create(
            nombre=f"Copia de {programa_original.nombre}",
            descripcion=programa_original.descripcion,
            tipo_contexto=programa_original.tipo_contexto,
            enfoque_metodologico=programa_original.enfoque_metodologico,
            poblacion_objetivo=programa_original.poblacion_objetivo,
            duracion_semanas=programa_original.duracion_semanas,
            tiene_cuestionarios=programa_original.tiene_cuestionarios,
            tiene_diarios=programa_original.tiene_diarios,
            creado_por=request.user.perfil_investigador,
            estado_publicacion=EstadoPublicacion.BORRADOR
        )

        for sesion in programa_original.sesiones.all():
            sesion.pk = None
            sesion.programa = programa_duplicado
            sesion.save()

        if programa_original.tiene_cuestionarios:
            if programa_original.cuestionario_pre:
                cuestionario_pre = programa_original.cuestionario_pre
                cuestionario_pre.pk = None
                cuestionario_pre.programa = programa_duplicado
                cuestionario_pre.save()
                programa_duplicado.cuestionario_pre = cuestionario_pre

            if programa_original.cuestionario_post:
                cuestionario_post = programa_original.cuestionario_post
                cuestionario_post.pk = None
                cuestionario_post.programa = programa_duplicado
                cuestionario_post.save()
                programa_duplicado.cuestionario_post = cuestionario_post

        programa_duplicado.save()

        serializer = ProgramaSerializer(programa_duplicado)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {"error": f"Error al duplicar el programa: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_abandonar(request, pk):
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not request.user.is_participante():
        return Response(
            {'error': 'Solo los participantes pueden abandonar programas'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        inscripcion = InscripcionPrograma.objects.get(
            programa=programa,
            participante=request.user.perfil_participante,
            estado_inscripcion=EstadoInscripcion.EN_PROGRESO
        )
        
        inscripcion.estado_inscripcion = EstadoInscripcion.ABANDONADO
        inscripcion.fecha_fin = timezone.now()
        inscripcion.save()
        
        return Response({'status': 'Programa abandonado exitosamente'})
    except InscripcionPrograma.DoesNotExist:
        return Response(
            {'error': 'No estás inscrito en este programa o no está en progreso'},
            status=status.HTTP_400_BAD_REQUEST
        )
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
        programas_completados = InscripcionPrograma.objects.filter(
            participante=request.user.perfil_participante,
            estado_inscripcion=EstadoInscripcion.COMPLETADO
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

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def programa_inscripciones(request, pk):
    """
    Obtiene la lista de inscripciones de un programa.
    """
    try:
        programa = Programa.objects.get(pk=pk)
        
        # Verificar permisos: solo el creador del programa puede ver las inscripciones
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {'error': 'No tienes permiso para ver las inscripciones de este programa'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener todas las inscripciones del programa
        inscripciones = InscripcionPrograma.objects.filter(
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
                'estado_inscripcion': inscripcion.estado_inscripcion
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



@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInvestigador])
def obtener_participantes_programa(request, programa_id):
    programa = get_object_or_404(Programa, id=programa_id)
    
    # Verificar que el investigador tiene permiso para ver este programa
    if programa.creado_por.usuario != request.user:
        return Response(
            {"error": "No tienes permiso para ver los participantes de este programa"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener participantes con datos anonimizados
    participantes = programa.participantes.all()
    serializer = ParticipanteSerializer(participantes, many=True)
    
    return Response({
        "id": programa.id,
        "nombre": programa.nombre,
        "participantes": serializer.data
    })

