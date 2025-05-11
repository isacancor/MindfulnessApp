from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cuestionario, RespuestaCuestionario
from .serializers import CuestionarioSerializer, RespuestaCuestionarioSerializer
from programa.models import Programa
from usuario.models import Usuario

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def cuestionario_list(request, programa_id):
    programa = get_object_or_404(Programa, id=programa_id)
    
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

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def respuesta_list(request, cuestionario_id):
    cuestionario = get_object_or_404(Cuestionario, id=cuestionario_id)
    
    if request.method == 'GET':
        # Solo los investigadores pueden ver todas las respuestas
        if request.user.is_investigador():
            respuestas = RespuestaCuestionario.objects.filter(cuestionario=cuestionario)
        else:
            # Los usuarios normales solo ven sus propias respuestas
            respuestas = RespuestaCuestionario.objects.filter(
                cuestionario=cuestionario,
                usuario=request.user
            )
        
        serializer = RespuestaCuestionarioSerializer(respuestas, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Verificar que el usuario es participante del programa
        if not request.user.is_participante():
            return Response(
                {'error': 'Solo los participantes pueden responder cuestionarios'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        # Verificar que el usuario está inscrito en el programa
        if not cuestionario.programa.participantes.filter(usuario=request.user).exists():
            return Response(
                {'error': 'Debes estar inscrito en el programa para responder el cuestionario'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que el usuario no ha respondido antes
        if RespuestaCuestionario.objects.filter(
            cuestionario=cuestionario,
            usuario=request.user
        ).exists():
            return Response(
                {'error': 'Ya has respondido este cuestionario'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear la respuesta con el cuestionario y usuario asociados
        data = request.data.copy()
        data['cuestionario'] = cuestionario.id
        data['usuario'] = request.user.id
        
        serializer = RespuestaCuestionarioSerializer(data=data)
        if serializer.is_valid():
            respuesta = serializer.save()
            return Response(RespuestaCuestionarioSerializer(respuesta).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def respuesta_detail(request, respuesta_id):
    respuesta = get_object_or_404(RespuestaCuestionario, id=respuesta_id)
    
    # Verificar permisos
    if not request.user.is_investigador() and respuesta.usuario != request.user:
        return Response(
            {'error': 'No tienes permiso para ver esta respuesta'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = RespuestaCuestionarioSerializer(respuesta)
    return Response(serializer.data)
