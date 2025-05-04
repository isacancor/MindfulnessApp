from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Programa
from .serializers import ProgramaSerializer

class ProgramaViewSet(viewsets.ModelViewSet):
    queryset = Programa.objects.all()
    serializer_class = ProgramaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Si el usuario es investigador, solo muestra sus programas
        if hasattr(self.request.user, 'investigador'):
            return Programa.objects.filter(creado_por=self.request.user.investigador)
        return Programa.objects.none()

    def perform_create(self, serializer):
        # Verificar si el usuario es investigador y tiene perfil
        if not self.request.user.is_investigador():
            raise PermissionError("Solo los investigadores pueden crear programas")
        
        # Obtener el perfil de investigador
        investigador = self.request.user.perfil_investigador
        if not investigador:
            raise ValueError("El usuario no tiene un perfil de investigador configurado")
        
        # Asignar el investigador al programa
        serializer.save(creado_por=investigador)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {'error': 'No se pudo eliminar el programa'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'])
    def participantes(self, request, pk=None):
        programa = self.get_object()
        participantes = programa.participantes.all()
        return Response({
            'total': participantes.count(),
            'participantes': [p.id for p in participantes]
        })
