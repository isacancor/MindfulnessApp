from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Programa, EstadoPublicacion
from .serializers import ProgramaSerializer

@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_list_create(request):
    if request.method == 'GET':
        if request.user.is_investigador():
            programas = Programa.objects.filter(creado_por=request.user)
        else:
            programas = Programa.objects.filter(estado_publicacion=EstadoPublicacion.PUBLICADO)
        serializer = ProgramaSerializer(programas, many=True)
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
            serializer.save(creado_por=investigador)
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
        if programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
            return Response(
                {'error': 'No se puede modificar un programa publicado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = ProgramaSerializer(programa, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if programa.estado_publicacion == EstadoPublicacion.PUBLICADO:
            return Response(
                {'error': 'No se puede eliminar un programa publicado'},
                status=status.HTTP_400_BAD_REQUEST
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
@permission_classes([permissions.IsAuthenticated])
def programa_participantes(request, pk):
    try:
        programa = Programa.objects.get(pk=pk)
        participantes = programa.participantes.all()
        return Response({
            'total': participantes.count(),
            'participantes': [p.id for p in participantes]
        })
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_publicar(request, pk):
    try:
        programa = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not request.user.is_investigador() or programa.creado_por != request.user:
        return Response(
            {'error': 'No tienes permiso para publicar este programa'},
            status=status.HTTP_403_FORBIDDEN
        )

    if not programa.puede_ser_publicado():
        return Response(
            {'error': 'No se puede publicar el programa porque faltan campos requeridos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    programa.publicar()
    return Response({'status': 'Programa publicado exitosamente'})

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

    participante = request.user.perfil_participante
    if not participante:
        return Response(
            {'error': 'El usuario no tiene un perfil de participante configurado'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verificar si el participante ya está enrolado en algún programa
    if participante.programas_inscritos.exists():
        return Response(
            {'error': 'Ya estás enrolado en un programa'},
            status=status.HTTP_400_BAD_REQUEST
        )

    programa.participantes.add(participante)
    return Response({'status': 'Enrolamiento exitoso'})
