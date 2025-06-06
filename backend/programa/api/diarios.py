from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from usuario.permissions import IsInvestigador
from django.shortcuts import get_object_or_404
from .models import Programa
from sesion.models import Sesion, DiarioSesion

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def programa_diarios_sesion(request, pk):
    """
    Obtiene los diarios de sesión de un programa, agrupados por sesión
    """
    try:
        programa = get_object_or_404(Programa, pk=pk)
        
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {'error': 'No tienes permiso para ver este programa'},
                status=status.HTTP_403_FORBIDDEN
            )

        sesiones = Sesion.objects.filter(programa=programa).order_by('semana')
        
        resultado = []
        for sesion in sesiones:
            diarios = DiarioSesion.objects.filter(
                sesion=sesion
            ).select_related('participante').order_by('participante__id', 'fecha_creacion')
            
            diarios_por_participante = {}
            for diario in diarios:
                id_participante = f"P{diario.participante.id}"
                if id_participante not in diarios_por_participante:
                    diarios_por_participante[id_participante] = []
                
                diarios_por_participante[id_participante].append({
                    'valoracion': diario.valoracion,
                    'comentario': diario.comentario,
                    'fecha': diario.fecha_creacion
                })
            
            resultado.append({
                'id': sesion.id,
                'semana': sesion.semana,
                'titulo': sesion.titulo,
                'tipo_practica': sesion.get_tipo_practica_display(),
                'duracion_estimada': sesion.duracion_estimada,
                'diarios': diarios_por_participante
            })

        return Response(resultado)

    except Exception as e:
        print(f"Error al obtener diarios de sesión: {str(e)}")
        return Response(
            {'error': 'Error al obtener los diarios de sesión'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 