from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Usuario, Investigador, Participante
from .serializers import UsuarioSerializer, InvestigadorSerializer, ParticipanteSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class InvestigadorViewSet(viewsets.ModelViewSet):
    queryset = Investigador.objects.all()
    serializer_class = InvestigadorSerializer

class ParticipanteViewSet(viewsets.ModelViewSet):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verificar_perfil_participante(request):
    """
    Verifica si el usuario tiene un perfil de participante y lo crea si no existe.
    """
    if not request.user.is_participante():
        return Response(
            {'error': 'Solo los participantes pueden acceder a esta funcionalidad'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        perfil = request.user.perfil_participante
        created = False
    except Usuario.perfil_participante.RelatedObjectDoesNotExist:
        # Crear el perfil si no existe
        perfil = Participante.objects.create(
            usuario=request.user,
            experienciaMindfulness='ninguna',
            condicionesSalud=''
        )
        created = True
    
    return Response({
        'message': 'Perfil verificado' if not created else 'Perfil creado',
        'perfil': ParticipanteSerializer(perfil).data
    })
