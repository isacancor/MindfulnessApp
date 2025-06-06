from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from usuario.permissions import IsInvestigador
from django.shortcuts import get_object_or_404
from ..models import Programa
from cuestionario.models import RespuestaCuestionario

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def programa_cuestionarios_y_respuestas(request, pk):
    """
    Obtiene los cuestionarios pre y post de un programa con sus respuestas,
    excluyendo las preguntas de tipo likert y likert_5_puntos
    """
    try:
        programa = get_object_or_404(Programa, pk=pk)
        
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {'error': 'No tienes permiso para ver este programa'},
                status=status.HTTP_403_FORBIDDEN
            )

        cuestionario_pre = programa.cuestionario_pre
        cuestionario_post = programa.cuestionario_post

        resultado = {
            'pre': None,
            'post': None
        }

        if cuestionario_pre:
            preguntas_pre = []
            indices_preguntas = []
            
            for i, p in enumerate(cuestionario_pre.preguntas):
                if p['tipo'] not in ['likert', 'likert-5-puntos']:
                    preguntas_pre.append(p['texto'])
                    indices_preguntas.append(i)
            
            respuestas_pre = RespuestaCuestionario.objects.filter(
                cuestionario=cuestionario_pre
            ).select_related('participante').order_by('participante__id', 'fecha_respuesta')

            respuestas_por_participante = {}
            for respuesta in respuestas_pre:
                id_participante = f"P{respuesta.participante.id}"
                respuestas_lista = []
                for i, pregunta in enumerate(cuestionario_pre.preguntas):
                    if i in indices_preguntas:
                        pregunta_id = str(pregunta['id'])
                        respuestas_lista.append(respuesta.respuestas.get(pregunta_id, 'N/A'))
                
                respuestas_por_participante[id_participante] = respuestas_lista

            resultado['pre'] = {
                'id': cuestionario_pre.id,
                'nombre': cuestionario_pre.titulo,
                'preguntas': preguntas_pre,
                'respuestas': respuestas_por_participante
            }

        if cuestionario_post:
            preguntas_post = []
            indices_preguntas = []
            
            for i, p in enumerate(cuestionario_post.preguntas):
                if p['tipo'] not in ['likert', 'likert-5-puntos']:
                    preguntas_post.append(p['texto'])
                    indices_preguntas.append(i)
            
            respuestas_post = RespuestaCuestionario.objects.filter(
                cuestionario=cuestionario_post
            ).select_related('participante').order_by('participante__id', 'fecha_respuesta')

            respuestas_por_participante = {}
            for respuesta in respuestas_post:
                id_participante = f"P{respuesta.participante.id}"
                respuestas_lista = []
                for i, pregunta in enumerate(cuestionario_post.preguntas):
                    if i in indices_preguntas:
                        pregunta_id = str(pregunta['id'])
                        respuestas_lista.append(respuesta.respuestas.get(pregunta_id, 'N/A'))
                
                respuestas_por_participante[id_participante] = respuestas_lista

            resultado['post'] = {
                'id': cuestionario_post.id,
                'nombre': cuestionario_post.titulo,
                'preguntas': preguntas_post,
                'respuestas': respuestas_por_participante
            }

        return Response(resultado)

    except Exception as e:
        print(f"Error al obtener cuestionarios y respuestas: {str(e)}")
        return Response(
            {'error': 'Error al obtener los cuestionarios y respuestas'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 