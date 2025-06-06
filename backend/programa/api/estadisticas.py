from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from usuario.permissions import IsInvestigador
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from ..models import Programa, InscripcionPrograma
from sesion.models import DiarioSesion
from cuestionario.models import RespuestaCuestionario

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInvestigador])
def investigador_estadisticas(request):
    """
    Obtiene estadísticas detalladas para el dashboard del investigador.
    Incluye conteo de sesiones completadas y cuestionarios respondidos
    por participantes en todos los programas del investigador.
    """
    try:
        programas = Programa.objects.filter(creado_por=request.user.perfil_investigador)
        total_programas = programas.count()
        
        participantes_activos = InscripcionPrograma.objects.filter(
            programa__creado_por=request.user.perfil_investigador,
        ).count()
        
        total_sesiones_completadas = DiarioSesion.objects.filter(
            sesion__programa__creado_por=request.user.perfil_investigador
        ).count()
        
        total_cuestionarios_respondidos = RespuestaCuestionario.objects.filter(
            Q(cuestionario__programas_pre__creado_por=request.user.perfil_investigador) | 
            Q(cuestionario__programas_post__creado_por=request.user.perfil_investigador)
        ).count()
        
        programas_stats = []
        for programa in programas:
            participantes_programa = programa.inscripciones.count()
            
            sesiones_completadas_programa = DiarioSesion.objects.filter(
                sesion__programa=programa
            ).count()
            
            respuestas_pre = RespuestaCuestionario.objects.filter(
                cuestionario=programa.cuestionario_pre
            ).count() if programa.cuestionario_pre else 0
            
            respuestas_post = RespuestaCuestionario.objects.filter(
                cuestionario=programa.cuestionario_post
            ).count() if programa.cuestionario_post else 0
            
            programas_stats.append({
                'id': programa.id,
                'nombre': programa.nombre,
                'estado': programa.estado_publicacion,
                'participantes': participantes_programa,
                'sesiones_completadas': sesiones_completadas_programa,
                'respuestas_pre': respuestas_pre,
                'respuestas_post': respuestas_post,
                'total_cuestionarios': respuestas_pre + respuestas_post
            })
        
        programas_destacados = sorted(
            programas_stats, 
            key=lambda x: x['participantes'], 
            reverse=True
        )[:3]
        
        return Response({
            'total_programas': total_programas,
            'participantes_activos': participantes_activos,
            'sesiones_completadas': total_sesiones_completadas,
            'cuestionarios_respondidos': total_cuestionarios_respondidos,
            'programas_stats': programas_stats,
            'programas_destacados': programas_destacados
        })
        
    except Exception as e:
        print("Error al obtener estadísticas:", str(e))
        return Response(
            {'error': f'Error al obtener estadísticas: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInvestigador])
def programa_estadisticas(request, pk):
    """
    Obtiene estadísticas detalladas de un programa específico.
    """
    try:
        programa = get_object_or_404(Programa, pk=pk)
        
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {"error": "No tienes permiso para ver las estadísticas de este programa"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        inscripciones = InscripcionPrograma.objects.filter(programa=programa)
        total_participantes = inscripciones.count()
        
        sesiones_totales = programa.sesiones.count()
        sesiones_completadas = DiarioSesion.objects.filter(
            sesion__programa=programa
        ).count()
        
        minutos_totales = 0
        diarios = DiarioSesion.objects.filter(
            sesion__programa=programa
        ).select_related('sesion')
        
        for diario in diarios:
            if diario.sesion.duracion_estimada:
                minutos_totales += diario.sesion.duracion_estimada
        
        porcentaje_completado = round((sesiones_completadas / (sesiones_totales * total_participantes) * 100) if total_participantes > 0 else 0, 2)
        
        diarios_detalle = []
        for diario in diarios:
            diarios_detalle.append({
                'id': diario.id,
                'participante_id': diario.participante.id,
                'sesion_id': diario.sesion.id,
                'sesion_titulo': diario.sesion.titulo,
                'semana': diario.sesion.semana,
                'fecha_creacion': diario.fecha_creacion,
                'valoracion': diario.valoracion,
                'comentario': diario.comentario
            })
        
        cuestionarios_detalle = {
            'pre': None,
            'post': None
        }
        
        if programa.cuestionario_pre:
            cuestionarios_detalle['pre'] = {
                'id': programa.cuestionario_pre.id,
                'titulo': programa.cuestionario_pre.titulo,
                'preguntas': programa.cuestionario_pre.preguntas,
                'respuestas': []
            }
            
            respuestas_pre = RespuestaCuestionario.objects.filter(
                cuestionario=programa.cuestionario_pre
            ).select_related('participante')
            
            for respuesta in respuestas_pre:
                cuestionarios_detalle['pre']['respuestas'].append({
                    'id': respuesta.id,
                    'participante_id': respuesta.participante.id,
                    'fecha_respuesta': respuesta.fecha_respuesta,
                    'respuestas': respuesta.respuestas
                })
        
        if programa.cuestionario_post:
            cuestionarios_detalle['post'] = {
                'id': programa.cuestionario_post.id,
                'titulo': programa.cuestionario_post.titulo,
                'preguntas': programa.cuestionario_post.preguntas,
                'respuestas': []
            }
            
            respuestas_post = RespuestaCuestionario.objects.filter(
                cuestionario=programa.cuestionario_post
            ).select_related('participante')
            
            for respuesta in respuestas_post:
                cuestionarios_detalle['post']['respuestas'].append({
                    'id': respuesta.id,
                    'participante_id': respuesta.participante.id,
                    'fecha_respuesta': respuesta.fecha_respuesta,
                    'respuestas': respuesta.respuestas
                })
        
        return Response({
            'total_participantes': total_participantes,
            'sesiones_completadas': sesiones_completadas,
            'porcentaje_completado': porcentaje_completado,
            'minutos_totales_practica': minutos_totales,
            'diarios_detalle': diarios_detalle,
            'cuestionarios_detalle': cuestionarios_detalle
        })
        
    except Exception as e:
        return Response(
            {"error": f"Error al obtener estadísticas: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInvestigador])
def programa_estadisticas_progreso(request, pk):
    """
    Obtiene estadísticas detalladas del progreso de cada participante en un programa.
    """
    try:
        programa = get_object_or_404(Programa, pk=pk)
        
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {"error": "No tienes permiso para ver las estadísticas de este programa"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        inscripciones = InscripcionPrograma.objects.filter(programa=programa).select_related('participante')
        
        total_sesiones = programa.sesiones.count()
        total_cuestionarios = 2 if programa.tiene_cuestionarios else 0
        
        progreso_participantes = {}
        
        for inscripcion in inscripciones:
            try:
                participante = inscripcion.participante
                id_anonimo = f"P{participante.id}"
                
                sesiones_completadas = DiarioSesion.objects.filter(
                    sesion__programa=programa,
                    participante=participante
                ).count()
                
                minutos_practica = 0
                diarios = DiarioSesion.objects.filter(
                    sesion__programa=programa,
                    participante=participante
                ).select_related('sesion')
                
                for diario in diarios:
                    if diario.sesion.duracion_estimada:
                        minutos_practica += diario.sesion.duracion_estimada
                
                cuestionarios_completados = 0
                if programa.cuestionario_pre:
                    if RespuestaCuestionario.objects.filter(
                        cuestionario=programa.cuestionario_pre,
                        participante=participante
                    ).exists():
                        cuestionarios_completados += 1
                
                if programa.cuestionario_post:
                    if RespuestaCuestionario.objects.filter(
                        cuestionario=programa.cuestionario_post,
                        participante=participante
                    ).exists():
                        cuestionarios_completados += 1
                
                estado = inscripcion.estado_inscripcion
                
                ultima_actividad = None
                ultimo_diario = DiarioSesion.objects.filter(
                    sesion__programa=programa,
                    participante=participante
                ).order_by('-fecha_creacion').first()
                
                ultima_respuesta = RespuestaCuestionario.objects.filter(
                    cuestionario__programa=programa,
                    participante=participante
                ).order_by('-fecha_respuesta').first()
                
                if ultimo_diario and ultima_respuesta:
                    ultima_actividad = max(ultimo_diario.fecha_creacion, ultima_respuesta.fecha_respuesta)
                elif ultimo_diario:
                    ultima_actividad = ultimo_diario.fecha_creacion
                elif ultima_respuesta:
                    ultima_actividad = ultima_respuesta.fecha_respuesta
                
                progreso_participantes[id_anonimo] = {
                    'estado': estado,
                    'sesiones_completadas': sesiones_completadas,
                    'total_sesiones': total_sesiones,
                    'cuestionarios_completados': cuestionarios_completados,
                    'total_cuestionarios': total_cuestionarios,
                    'minutos_practica': minutos_practica,
                    'ultima_actividad': ultima_actividad.strftime('%Y-%m-%d %H:%M') if ultima_actividad else 'N/A'
                }
            except Exception as e:
                print(f"Error procesando participante {participante.id}: {str(e)}")
                continue
        
        return Response({
            'programa_id': programa.id,
            'programa_nombre': programa.nombre,
            'total_sesiones': total_sesiones,
            'total_cuestionarios': total_cuestionarios,
            'progreso_participantes': progreso_participantes
        })
        
    except Programa.DoesNotExist:
        return Response(
            {"error": "El programa no existe"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error en programa_estadisticas_progreso: {str(e)}")
        return Response(
            {"error": f"Error al obtener estadísticas de progreso: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 