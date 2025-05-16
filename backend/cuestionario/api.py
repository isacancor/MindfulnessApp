from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cuestionario, RespuestaCuestionario
from .serializers import CuestionarioSerializer, RespuestaCuestionarioSerializer
from programa.models import Programa
from usuario.models import Participante
from programa.models import InscripcionPrograma, EstadoPrograma

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cuestionario_list(request, pk):
    programa = get_object_or_404(Programa, id=pk)
    
    if request.method == 'GET':
        cuestionarios = Cuestionario.objects.filter(programa=programa)
        serializer = CuestionarioSerializer(cuestionarios, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Verificar que el usuario es investigador
        if not request.user.is_investigador():
            return Response(
                {'error': 'Solo los investigadores pueden crear cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que el programa está en borrador
        if programa.estado_publicacion != 'borrador':
            return Response(
                {'error': 'Solo se pueden crear cuestionarios en programas en borrador'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que no existe un cuestionario del mismo tipo
        tipo = request.data.get('tipo')
        if not tipo or tipo not in ['pre', 'post']:
            return Response(
                {'error': 'El tipo de cuestionario debe ser "pre" o "post"'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if Cuestionario.objects.filter(programa=programa, tipo=tipo).exists():
            return Response(
                {'error': f'Ya existe un cuestionario {tipo} para este programa'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear el cuestionario con el programa asociado
        data = request.data.copy()
        data['programa'] = programa.id  # Aseguramos que el programa esté en los datos
        
        serializer = CuestionarioSerializer(data=data)
        if serializer.is_valid():
            cuestionario = serializer.save()
            
            # Actualizar el programa con el cuestionario correspondiente
            if tipo == 'pre':
                programa.cuestionario_pre = cuestionario
            else:
                programa.cuestionario_post = cuestionario
            programa.save()
            
            return Response(CuestionarioSerializer(cuestionario).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def cuestionario_detail(request, cuestionario_id):
    cuestionario = get_object_or_404(Cuestionario, id=cuestionario_id)
    
    if request.method == 'GET':
        serializer = CuestionarioSerializer(cuestionario)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        # Verificar que el usuario es investigador
        if not request.user.is_investigador():
            return Response(
                {'error': 'Solo los investigadores pueden modificar cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que el programa está en borrador
        if cuestionario.programa.estado_publicacion != 'borrador':
            return Response(
                {'error': 'Solo se pueden modificar cuestionarios en programas en borrador'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Asegurarnos de que el programa no cambie
        data = request.data.copy()
        data['programa'] = cuestionario.programa.id
        data['tipo'] = cuestionario.tipo  # Mantener el tipo original
        
        serializer = CuestionarioSerializer(cuestionario, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Verificar que el usuario es investigador
        if not request.user.is_investigador():
            return Response(
                {'error': 'Solo los investigadores pueden eliminar cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que el programa está en borrador
        if cuestionario.programa.estado_publicacion != 'borrador':
            return Response(
                {'error': 'Solo se pueden eliminar cuestionarios en programas en borrador'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        cuestionario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_cuestionario_pre(request):
    """
    Obtiene el cuestionario pre del programa en que está enrolado el participante
    """
    try:
        # Verificar que el usuario es participante
        if not request.user.is_participante():
            return Response(
                {'error': 'Solo los participantes pueden acceder a los cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener la inscripción activa del participante
        inscripcion = InscripcionPrograma.objects.filter(
            participante=request.user.perfil_participante,
            estado_programa=EstadoPrograma.EN_PROGRESO
        ).select_related('programa').first()
        
        if not inscripcion:
            return Response(
                {'error': 'No tienes programas activos actualmente'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        programa = inscripcion.programa
            
        # Obtener el cuestionario pre del programa
        if not programa.cuestionario_pre:
            return Response(
                {'error': 'El programa no tiene cuestionario pre configurado'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        cuestionario = programa.cuestionario_pre
        
        # Verificar si el participante ya respondió este cuestionario
        if RespuestaCuestionario.objects.filter(
            cuestionario=cuestionario,
            participante=request.user.perfil_participante
        ).exists():
            return Response(
                {'error': 'Ya has respondido este cuestionario pre'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CuestionarioSerializer(cuestionario)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_cuestionario_post(request):
    """
    Obtiene el cuestionario post del programa en que está enrolado el participante
    """
    try:
        # Verificar que el usuario es participante
        if not request.user.is_participante():
            return Response(
                {'error': 'Solo los participantes pueden acceder a los cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener la inscripción activa del participante
        inscripcion = InscripcionPrograma.objects.filter(
            participante=request.user.perfil_participante,
            estado_programa=EstadoPrograma.EN_PROGRESO
        ).select_related('programa').first()
        
        if not inscripcion:
            return Response(
                {'error': 'No tienes programas activos actualmente'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        programa = inscripcion.programa
            
        # Obtener el cuestionario post del programa
        if not programa.cuestionario_post:
            return Response(
                {'error': 'El programa no tiene cuestionario post configurado'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        cuestionario = programa.cuestionario_post
        
        # Verificar si el participante ya respondió este cuestionario
        if RespuestaCuestionario.objects.filter(
            cuestionario=cuestionario,
            participante=request.user.perfil_participante
        ).exists():
            return Response(
                {'error': 'Ya has respondido este cuestionario post'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CuestionarioSerializer(cuestionario)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def responder_cuestionario_pre(request):
    """
    Permite a un participante responder el cuestionario pre
    """
    try:
        # Verificar que el usuario es participante
        if not request.user.is_participante():
            return Response(
                {'error': 'Solo los participantes pueden responder cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener la inscripción activa del participante
        inscripcion = InscripcionPrograma.objects.filter(
            participante=request.user.perfil_participante,
            estado_programa=EstadoPrograma.EN_PROGRESO
        ).select_related('programa').first()
        
        if not inscripcion:
            return Response(
                {'error': 'No tienes programas activos actualmente'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        programa = inscripcion.programa
            
        # Obtener el cuestionario pre del programa
        if not programa.cuestionario_pre:
            return Response(
                {'error': 'El programa no tiene cuestionario pre configurado'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        cuestionario = programa.cuestionario_pre

        # Verificar si el usuario ya respondió este cuestionario
        if RespuestaCuestionario.objects.filter(
            cuestionario=cuestionario,
            participante=request.user.perfil_participante
        ).exists():
            return Response(
                {'error': 'Ya has respondido este cuestionario pre'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear la respuesta
        data = {
            'cuestionario': cuestionario.id,
            'participante': request.user.perfil_participante.id,
            'respuestas': request.data.get('respuestas', {})
        }

        serializer = RespuestaCuestionarioSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def responder_cuestionario_post(request):
    """
    Permite a un participante responder el cuestionario post
    """
    try:
        # Verificar que el usuario es participante
        if not request.user.is_participante():
            return Response(
                {'error': 'Solo los participantes pueden responder cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener la inscripción activa del participante
        inscripcion = InscripcionPrograma.objects.filter(
            participante=request.user.perfil_participante,
            estado_programa=EstadoPrograma.EN_PROGRESO
        ).select_related('programa').first()
        
        if not inscripcion:
            return Response(
                {'error': 'No tienes programas activos actualmente'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        programa = inscripcion.programa
            
        # Obtener el cuestionario post del programa
        if not programa.cuestionario_post:
            return Response(
                {'error': 'El programa no tiene cuestionario post configurado'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        cuestionario = programa.cuestionario_post

        # Verificar si el usuario ya respondió este cuestionario
        if RespuestaCuestionario.objects.filter(
            cuestionario=cuestionario,
            participante=request.user.perfil_participante
        ).exists():
            return Response(
                {'error': 'Ya has respondido este cuestionario post'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear la respuesta
        data = {
            'cuestionario': cuestionario.id,
            'participante': request.user.perfil_participante.id,
            'respuestas': request.data.get('respuestas', {})
        }

        serializer = RespuestaCuestionarioSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            
            # Marcar el programa como completado
            inscripcion.estado_programa = EstadoPrograma.COMPLETADO
            inscripcion.save()
            
            return Response({
                'id': programa.id,
                'message': 'Cuestionario respondido y programa completado exitosamente'
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
