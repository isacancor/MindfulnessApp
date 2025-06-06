from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from usuario.permissions import IsInvestigador, IsParticipante
from .models import Programa, EstadoPublicacion, InscripcionPrograma, EstadoPrograma
from .serializers import ProgramaSerializer, ParticipantesProgramaSerializer
from sesion.models import Sesion, EtiquetaPractica, TipoContenido, DiarioSesion
from django.shortcuts import get_object_or_404
from cuestionario.models import Cuestionario, RespuestaCuestionario
from django.utils import timezone
from django.db.models import Count, Q
import csv
import json
import pandas as pd
from io import StringIO, BytesIO
from django.http import HttpResponse, JsonResponse, FileResponse
from django.db.models import Avg, Count, Q, F, Sum
from usuario.models import Participante

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
        # Verificar que el usuario es el investigador
        if programa.creado_por != request.user.perfil_investigador:
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

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_publicar(request, pk):
    programa = get_object_or_404(Programa, pk=pk)
    
    # Verificar que el usuario es el investigador del programa
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
                estado_programa=EstadoPrograma.EN_PROGRESO
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
        estado_programa=EstadoPrograma.EN_PROGRESO
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
            estado_programa=EstadoPrograma.EN_PROGRESO
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

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def investigador_estadisticas(request):
    """
    Obtiene estadísticas detalladas para el dashboard del investigador.
    Incluye conteo de sesiones completadas y cuestionarios respondidos
    por participantes en todos los programas del investigador.
    """
    if not request.user.is_investigador():
        return Response(
            {'error': 'Solo los investigadores pueden acceder a estas estadísticas'},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        # Programas creados por el investigador
        programas = Programa.objects.filter(creado_por=request.user.perfil_investigador)
        total_programas = programas.count()
        
        # Participantes activos en todos los programas
        participantes_activos = InscripcionPrograma.objects.filter(
            programa__creado_por=request.user.perfil_investigador,
        ).count()
        
        # Total de sesiones completadas (diarios registrados)
        total_sesiones_completadas = DiarioSesion.objects.filter(
            sesion__programa__creado_por=request.user.perfil_investigador
        ).count()
        
        # Total de cuestionarios respondidos
        total_cuestionarios_respondidos = RespuestaCuestionario.objects.filter(
            Q(cuestionario__programas_pre__creado_por=request.user.perfil_investigador) | 
            Q(cuestionario__programas_post__creado_por=request.user.perfil_investigador)
        ).count()
        
        # Estadísticas por programa
        programas_stats = []
        for programa in programas:
            # Contar participantes del programa
            participantes_programa = programa.inscripciones.count()
            
            # Contar sesiones completadas en este programa
            sesiones_completadas_programa = DiarioSesion.objects.filter(
                sesion__programa=programa
            ).count()
            
            # Contar respuestas a cuestionarios de este programa
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
        
        # Programas con más participación (ordenados por participantes)
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
def exportar_datos_programa(request, pk):
    """
    Exporta datos de un programa en diferentes formatos:
    - CSV
    - Excel
    - JSON
    
    Permite exportar:
    - todos: todos los datos del programa
    - cuestionarios: solo los cuestionarios (pre y post) con sus respuestas
    - diarios: solo los diarios de sesiones
    - participantes: solo los datos de los participantes
    """
    try:
        programa = Programa.objects.get(pk=pk)
        
        # Verificar que el programa pertenece al investigador actual
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {"error": "No tienes permiso para exportar datos de este programa"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener parámetros
        tipo_exportacion = request.query_params.get('tipo', 'todos')
        formato = request.query_params.get('formato', 'csv')
        
        # Validar parámetros
        tipos_validos = ['todos', 'cuestionarios', 'diarios', 'participantes']
        formatos_validos = ['csv', 'excel', 'json']
        
        if tipo_exportacion not in tipos_validos:
            return Response(
                {"error": f"Tipo de exportación no válido. Opciones: {', '.join(tipos_validos)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if formato not in formatos_validos:
            return Response(
                {"error": f"Formato no válido. Opciones: {', '.join(formatos_validos)}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Recopilar datos según el tipo de exportación
        datos = recopilar_datos(programa, tipo_exportacion)
        
        # Exportar según el formato solicitado
        if formato == 'csv':
            return exportar_csv(datos, programa.nombre, tipo_exportacion)
        elif formato == 'excel':
            return exportar_excel(datos, programa.nombre, tipo_exportacion)
        elif formato == 'json':
            return exportar_json(datos, programa.nombre, tipo_exportacion)
        
    except Programa.DoesNotExist:
        return Response(
            {"error": "Programa no encontrado"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": f"Error al exportar datos: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def recopilar_datos(programa, tipo_exportacion):
    """
    Recopila los datos necesarios según el tipo de exportación solicitado
    """
    datos = {}
    
    try:
        # Información básica del programa (siempre se incluye)
        datos['programa'] = {
            'id': programa.id,
            'nombre': programa.nombre,
            'descripcion': programa.descripcion,
            'tipo_contexto': programa.tipo_contexto,
            'enfoque_metodologico': programa.enfoque_metodologico,
            'poblacion_objetivo': programa.poblacion_objetivo,
            'duracion_semanas': programa.duracion_semanas,
            'fecha_creacion': programa.fecha_creacion,
            'fecha_publicacion': programa.fecha_publicacion,
        }
        
        # Datos de participantes
        if tipo_exportacion in ['todos', 'participantes']:
            datos['participantes'] = []
            inscripciones = InscripcionPrograma.objects.filter(programa=programa).select_related('participante')
            
            for inscripcion in inscripciones:
                try:
                    participante = inscripcion.participante
                    if not participante:
                        print(f"Advertencia: Inscripción {inscripcion.id} sin participante asociado")
                        continue
                        
                    # Obtener datos anónimos del participante
                    datos_participante = {
                        'id_anonimo': f"P{participante.id}",  # ID anónimo
                        'genero': getattr(participante.usuario, 'genero', 'No especificado'),
                        'fecha_inicio': inscripcion.fecha_inicio,
                        'fecha_fin': inscripcion.fecha_fin,
                        'estado_programa': inscripcion.estado_programa
                    }
                    
                    # Añadir estadísticas de participación
                    sesiones_totales = programa.sesiones.count()
                    sesiones_completadas = DiarioSesion.objects.filter(
                        participante=participante,
                        sesion__programa=programa
                    ).count()
                    
                    datos_participante['sesiones_completadas'] = sesiones_completadas
                    datos_participante['porcentaje_completado'] = round((sesiones_completadas / sesiones_totales * 100) if sesiones_totales > 0 else 0, 2)
                    
                    # Verificar si completó los cuestionarios
                    datos_participante['cuestionario_pre_completado'] = RespuestaCuestionario.objects.filter(
                        usuario=participante.usuario,
                        cuestionario__programa=programa,
                        cuestionario__tipo='pre'
                    ).exists()
                    
                    datos_participante['cuestionario_post_completado'] = RespuestaCuestionario.objects.filter(
                        usuario=participante.usuario,
                        cuestionario__programa=programa,
                        cuestionario__tipo='post'
                    ).exists()
                    
                    datos['participantes'].append(datos_participante)
                except Exception as e:
                    print(f"Error procesando participante de inscripción {inscripcion.id}: {str(e)}")
                    continue
        
        # Datos de cuestionarios
        if tipo_exportacion in ['todos', 'cuestionarios']:
            datos['cuestionarios'] = {
                'pre': {'preguntas': [], 'respuestas': []},
                'post': {'preguntas': [], 'respuestas': []}
            }
            
            # Obtener cuestionarios pre y post
            cuestionario_pre = Cuestionario.objects.filter(programa=programa, tipo='pre').first()
            cuestionario_post = Cuestionario.objects.filter(programa=programa, tipo='post').first()
            
            if cuestionario_pre:
                datos['cuestionarios']['pre']['id'] = cuestionario_pre.id
                datos['cuestionarios']['pre']['titulo'] = cuestionario_pre.titulo
                datos['cuestionarios']['pre']['preguntas'] = cuestionario_pre.preguntas
                
                # Obtener respuestas anónimas
                respuestas_pre = RespuestaCuestionario.objects.filter(cuestionario=cuestionario_pre)
                for resp in respuestas_pre:
                    respuesta_anonima = {
                        'id_participante_anonimo': f"P{resp.usuario.id}",
                        'fecha_respuesta': resp.fecha_respuesta,
                        'respuestas': resp.respuestas
                    }
                    datos['cuestionarios']['pre']['respuestas'].append(respuesta_anonima)
            
            if cuestionario_post:
                datos['cuestionarios']['post']['id'] = cuestionario_post.id
                datos['cuestionarios']['post']['titulo'] = cuestionario_post.titulo
                datos['cuestionarios']['post']['preguntas'] = cuestionario_post.preguntas
                
                # Obtener respuestas anónimas
                respuestas_post = RespuestaCuestionario.objects.filter(cuestionario=cuestionario_post)
                for resp in respuestas_post:
                    respuesta_anonima = {
                        'id_participante_anonimo': f"P{resp.usuario.id}",
                        'fecha_respuesta': resp.fecha_respuesta,
                        'respuestas': resp.respuestas
                    }
                    datos['cuestionarios']['post']['respuestas'].append(respuesta_anonima)
        
        # Datos de diarios de sesión
        if tipo_exportacion in ['todos', 'diarios']:
            datos['diarios'] = []
            
            # Obtener todas las sesiones y diarios
            sesiones = Sesion.objects.filter(programa=programa).order_by('semana')
            
            for sesion in sesiones:
                datos_sesion = {
                    'id': sesion.id,
                    'titulo': sesion.titulo,
                    'semana': sesion.semana,
                    'duracion_estimada': sesion.duracion_estimada,
                    'tipo_practica': sesion.tipo_practica,
                    'diarios': []
                }
                
                diarios = DiarioSesion.objects.filter(sesion=sesion)
                for diario in diarios:
                    diario_anonimo = {
                        'id_participante_anonimo': f"P{diario.participante.id}",
                        'fecha_creacion': diario.fecha_creacion,
                        'valoracion': diario.valoracion,
                        'comentario': diario.comentario
                    }
                    datos_sesion['diarios'].append(diario_anonimo)
                
                datos['diarios'].append(datos_sesion)
        
        return datos
    except Exception as e:
        print(f"Error en recopilar_datos: {str(e)}")
        raise

def exportar_csv(datos, nombre_programa, tipo_exportacion):
    """
    Exporta los datos en formato CSV
    """
    try:
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{nombre_programa}_{tipo_exportacion}.csv"'
        
        writer = csv.writer(response)
        
        # Exportar según el tipo de datos
        if tipo_exportacion == 'participantes' or tipo_exportacion == 'todos':
            # Encabezados para participantes
            if 'participantes' in datos:
                writer.writerow(['ID Anónimo', 'Género', 'Fecha Inicio', 'Fecha Fin', 'Estado', 
                                'Sesiones Completadas', 'Porcentaje Completado', 
                                'Cuestionario Pre Completado', 'Cuestionario Post Completado'])
                
                for p in datos['participantes']:
                    try:
                        writer.writerow([
                            p.get('id_anonimo', 'N/A'),
                            p.get('genero', 'No especificado'),
                            p.get('fecha_inicio', 'N/A'),
                            p.get('fecha_fin', 'N/A') if p.get('fecha_fin') else 'N/A',
                            p.get('estado_programa', 'N/A'),
                            p.get('sesiones_completadas', 0),
                            f"{p.get('porcentaje_completado', 0):.2f}%",
                            'Sí' if p.get('cuestionario_pre_completado', False) else 'No',
                            'Sí' if p.get('cuestionario_post_completado', False) else 'No'
                        ])
                    except Exception as e:
                        print(f"Error escribiendo fila de participante: {str(e)}")
                        continue
        
        if tipo_exportacion == 'cuestionarios' or tipo_exportacion == 'todos':
            if 'cuestionarios' in datos:
                # Cuestionario Pre
                if datos['cuestionarios']['pre'].get('preguntas'):
                    try:
                        writer.writerow([])
                        writer.writerow(['CUESTIONARIO PRE'])
                        # Crear encabezados dinámicos según las preguntas
                        encabezados = ['ID Participante', 'Fecha Respuesta']
                        
                        # Añadir títulos de las preguntas a los encabezados
                        for pregunta in datos['cuestionarios']['pre']['preguntas']:
                            encabezados.append(pregunta.get('titulo', f"Pregunta {pregunta.get('id', '')}")[:50])
                        
                        writer.writerow(encabezados)
                        
                        # Añadir respuestas
                        for respuesta in datos['cuestionarios']['pre']['respuestas']:
                            try:
                                fila = [
                                    respuesta.get('id_participante_anonimo', 'N/A'),
                                    respuesta.get('fecha_respuesta', 'N/A')
                                ]
                                
                                # Para cada pregunta en el cuestionario, buscar la respuesta correspondiente
                                for pregunta in datos['cuestionarios']['pre']['preguntas']:
                                    pregunta_id = str(pregunta.get('id', ''))
                                    respuestas = respuesta.get('respuestas', {})
                                    fila.append(respuestas.get(pregunta_id, 'N/A'))
                                
                                writer.writerow(fila)
                            except Exception as e:
                                print(f"Error escribiendo respuesta pre: {str(e)}")
                                continue
                    except Exception as e:
                        print(f"Error procesando cuestionario pre: {str(e)}")
                
                # Cuestionario Post
                if datos['cuestionarios']['post'].get('preguntas'):
                    try:
                        writer.writerow([])
                        writer.writerow(['CUESTIONARIO POST'])
                        # Crear encabezados dinámicos según las preguntas
                        encabezados = ['ID Participante', 'Fecha Respuesta']
                        
                        # Añadir títulos de las preguntas a los encabezados
                        for pregunta in datos['cuestionarios']['post']['preguntas']:
                            encabezados.append(pregunta.get('titulo', f"Pregunta {pregunta.get('id', '')}")[:50])
                        
                        writer.writerow(encabezados)
                        
                        # Añadir respuestas
                        for respuesta in datos['cuestionarios']['post']['respuestas']:
                            try:
                                fila = [
                                    respuesta.get('id_participante_anonimo', 'N/A'),
                                    respuesta.get('fecha_respuesta', 'N/A')
                                ]
                                
                                # Para cada pregunta en el cuestionario, buscar la respuesta correspondiente
                                for pregunta in datos['cuestionarios']['post']['preguntas']:
                                    pregunta_id = str(pregunta.get('id', ''))
                                    respuestas = respuesta.get('respuestas', {})
                                    fila.append(respuestas.get(pregunta_id, 'N/A'))
                                
                                writer.writerow(fila)
                            except Exception as e:
                                print(f"Error escribiendo respuesta post: {str(e)}")
                                continue
                    except Exception as e:
                        print(f"Error procesando cuestionario post: {str(e)}")
        
        if tipo_exportacion == 'diarios' or tipo_exportacion == 'todos':
            if 'diarios' in datos:
                try:
                    writer.writerow([])
                    writer.writerow(['DIARIOS DE SESIONES'])
                    writer.writerow(['Semana', 'Sesión', 'ID Participante', 'Fecha', 'Valoración', 'Comentario'])
                    
                    for sesion in datos['diarios']:
                        for diario in sesion.get('diarios', []):
                            try:
                                writer.writerow([
                                    sesion.get('semana', 'N/A'),
                                    sesion.get('titulo', 'N/A'),
                                    diario.get('id_participante_anonimo', 'N/A'),
                                    diario.get('fecha_creacion', 'N/A'),
                                    diario.get('valoracion', 'N/A'),
                                    diario.get('comentario', 'N/A')
                                ])
                            except Exception as e:
                                print(f"Error escribiendo diario: {str(e)}")
                                continue
                except Exception as e:
                    print(f"Error procesando diarios: {str(e)}")
        
        return response
    except Exception as e:
        print(f"Error en exportar_csv: {str(e)}")
        raise

def exportar_excel(datos, nombre_programa, tipo_exportacion):
    """
    Exporta los datos en formato Excel
    """
    # Crear un archivo Excel en memoria
    output = BytesIO()
    workbook = pd.ExcelWriter(output, engine='xlsxwriter')
    
    # Exportar según el tipo de datos seleccionado
    if tipo_exportacion == 'participantes' or tipo_exportacion == 'todos':
        if 'participantes' in datos:
            # Crear DataFrame de pandas con los datos de participantes
            df_participantes = pd.DataFrame(datos['participantes'])
            
            # Renombrar columnas para mejor legibilidad
            df_participantes = df_participantes.rename(columns={
                'id_anonimo': 'ID Anónimo',
                'genero': 'Género',
                'fecha_inicio': 'Fecha Inicio',
                'fecha_fin': 'Fecha Fin',
                'estado_programa': 'Estado',
                'sesiones_completadas': 'Sesiones Completadas',
                'porcentaje_completado': 'Porcentaje Completado (%)',
                'cuestionario_pre_completado': 'Cuestionario Pre Completado',
                'cuestionario_post_completado': 'Cuestionario Post Completado'
            })
            
            # Guardar en una hoja
            df_participantes.to_excel(workbook, sheet_name='Participantes', index=False)
    
    if tipo_exportacion == 'cuestionarios' or tipo_exportacion == 'todos':
        if 'cuestionarios' in datos:
            # Cuestionario Pre
            if datos['cuestionarios']['pre'].get('preguntas'):
                # Preparar los datos para el DataFrame
                filas_pre = []
                
                for respuesta in datos['cuestionarios']['pre']['respuestas']:
                    fila = {
                        'ID Participante': respuesta['id_participante_anonimo'],
                        'Fecha Respuesta': respuesta['fecha_respuesta']
                    }
                    
                    # Para cada pregunta en el cuestionario, buscar la respuesta
                    for pregunta in datos['cuestionarios']['pre']['preguntas']:
                        pregunta_id = str(pregunta.get('id', ''))
                        pregunta_titulo = pregunta.get('titulo', f"Pregunta {pregunta_id}")[:50]
                        
                        if pregunta_id in respuesta['respuestas']:
                            fila[pregunta_titulo] = respuesta['respuestas'][pregunta_id]
                        else:
                            fila[pregunta_titulo] = 'N/A'
                    
                    filas_pre.append(fila)
                
                # Crear DataFrame y guardar en hoja
                if filas_pre:
                    df_pre = pd.DataFrame(filas_pre)
                    df_pre.to_excel(workbook, sheet_name='Cuestionario Pre', index=False)
            
            # Cuestionario Post
            if datos['cuestionarios']['post'].get('preguntas'):
                # Preparar los datos para el DataFrame
                filas_post = []
                
                for respuesta in datos['cuestionarios']['post']['respuestas']:
                    fila = {
                        'ID Participante': respuesta['id_participante_anonimo'],
                        'Fecha Respuesta': respuesta['fecha_respuesta']
                    }
                    
                    # Para cada pregunta en el cuestionario, buscar la respuesta
                    for pregunta in datos['cuestionarios']['post']['preguntas']:
                        pregunta_id = str(pregunta.get('id', ''))
                        pregunta_titulo = pregunta.get('titulo', f"Pregunta {pregunta_id}")[:50]
                        
                        if pregunta_id in respuesta['respuestas']:
                            fila[pregunta_titulo] = respuesta['respuestas'][pregunta_id]
                        else:
                            fila[pregunta_titulo] = 'N/A'
                    
                    filas_post.append(fila)
                
                # Crear DataFrame y guardar en hoja
                if filas_post:
                    df_post = pd.DataFrame(filas_post)
                    df_post.to_excel(workbook, sheet_name='Cuestionario Post', index=False)
    
    if tipo_exportacion == 'diarios' or tipo_exportacion == 'todos':
        if 'diarios' in datos:
            # Preparar los datos para el DataFrame
            filas_diarios = []
            
            for sesion in datos['diarios']:
                for diario in sesion['diarios']:
                    fila = {
                        'Semana': sesion['semana'],
                        'Sesión': sesion['titulo'],
                        'ID Participante': diario['id_participante_anonimo'],
                        'Fecha': diario['fecha_creacion'],
                        'Valoración': diario['valoracion'],
                        'Comentario': diario['comentario'] if diario['comentario'] else 'N/A'
                    }
                    filas_diarios.append(fila)
            
            # Crear DataFrame y guardar en hoja
            if filas_diarios:
                df_diarios = pd.DataFrame(filas_diarios)
                df_diarios.to_excel(workbook, sheet_name='Diarios de Sesiones', index=False)
    
    # Guardar el libro y configurar la respuesta
    workbook.close()
    output.seek(0)
    
    response = HttpResponse(
        output.read(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{nombre_programa}_{tipo_exportacion}.xlsx"'
    
    return response

def exportar_json(datos, nombre_programa, tipo_exportacion):
    """
    Exporta los datos en formato JSON
    """
    # Filtrar datos según el tipo de exportación
    datos_filtrados = {}
    datos_filtrados['programa'] = datos['programa']
    
    if tipo_exportacion == 'participantes' or tipo_exportacion == 'todos':
        if 'participantes' in datos:
            datos_filtrados['participantes'] = datos['participantes']
    
    if tipo_exportacion == 'cuestionarios' or tipo_exportacion == 'todos':
        if 'cuestionarios' in datos:
            datos_filtrados['cuestionarios'] = datos['cuestionarios']
    
    if tipo_exportacion == 'diarios' or tipo_exportacion == 'todos':
        if 'diarios' in datos:
            datos_filtrados['diarios'] = datos['diarios']
    
    # Configurar la respuesta JSON
    response = HttpResponse(json.dumps(datos_filtrados, default=str, indent=4), content_type='application/json')
    response['Content-Disposition'] = f'attachment; filename="{nombre_programa}_{tipo_exportacion}.json"'
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_participantes_programa(request, pk):
    # Verificar que el usuario es investigador
    if not request.user.is_investigador():
        return Response(
            {"error": "No tienes permisos para ver los participantes del programa"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Obtener el programa
    programa = get_object_or_404(Programa, id=pk)
    
    # Verificar que el investigador es el creador del programa
    if programa.creado_por != request.user.perfil_investigador:
        return Response(
            {"error": "Solo el investigador creador puede ver los participantes del programa"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Serializar y devolver los datos
    serializer = ParticipantesProgramaSerializer(programa)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInvestigador])
def programa_estadisticas(request, pk):
    """
    Obtiene estadísticas detalladas de un programa específico.
    Incluye:
    - Número total de participantes
    - Porcentaje de sesiones completadas
    - Minutos totales de práctica
    - Datos de cuestionarios pre/post
    """
    try:
        programa = get_object_or_404(Programa, pk=pk)
        
        # Verificar que el programa pertenece al investigador actual
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {"error": "No tienes permiso para ver las estadísticas de este programa"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener inscripciones del programa
        inscripciones = InscripcionPrograma.objects.filter(programa=programa)
        total_participantes = inscripciones.count()
        
        # Calcular sesiones completadas
        sesiones_totales = programa.sesiones.count()
        sesiones_completadas = DiarioSesion.objects.filter(
            sesion__programa=programa
        ).count()
        
        # Calcular minutos totales de práctica (solo sesiones completadas)
        minutos_totales = 0
        diarios = DiarioSesion.objects.filter(
            sesion__programa=programa
        ).select_related('sesion')
        
        for diario in diarios:
            if diario.sesion.duracion_estimada:
                minutos_totales += diario.sesion.duracion_estimada
        
       
        # Obtener datos de cuestionarios
        cuestionario_pre = programa.cuestionario_pre
        cuestionario_post = programa.cuestionario_post
        
        # TODO: quitar
        datos_cuestionarios = []
        
        # Calcular porcentaje de sesiones completadas
        porcentaje_completado = round((sesiones_completadas / (sesiones_totales * total_participantes) * 100) if total_participantes > 0 else 0, 2)
        
        # Obtener datos detallados de diarios
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
        
        # Obtener datos detallados de cuestionarios
        cuestionarios_detalle = {
            'pre': None,
            'post': None
        }
        
        if cuestionario_pre:
            cuestionarios_detalle['pre'] = {
                'id': cuestionario_pre.id,
                'titulo': cuestionario_pre.titulo,
                'preguntas': cuestionario_pre.preguntas,
                'respuestas': []
            }
            
            respuestas_pre = RespuestaCuestionario.objects.filter(
                cuestionario=cuestionario_pre
            ).select_related('participante')
            
            for respuesta in respuestas_pre:
                cuestionarios_detalle['pre']['respuestas'].append({
                    'id': respuesta.id,
                    'participante_id': respuesta.participante.id,
                    'fecha_respuesta': respuesta.fecha_respuesta,
                    'respuestas': respuesta.respuestas
                })
        
        if cuestionario_post:
            cuestionarios_detalle['post'] = {
                'id': cuestionario_post.id,
                'titulo': cuestionario_post.titulo,
                'preguntas': cuestionario_post.preguntas,
                'respuestas': []
            }
            
            respuestas_post = RespuestaCuestionario.objects.filter(
                cuestionario=cuestionario_post
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
            'datos_cuestionarios': datos_cuestionarios,
            'diarios_detalle': diarios_detalle,
            'cuestionarios_detalle': cuestionarios_detalle
        })
        
    except Exception as e:
        return Response(
            {"error": f"Error al obtener estadísticas: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def programa_duplicar(request, pk):
    try:
        programa_original = Programa.objects.get(pk=pk)
    except Programa.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Verificar que el usuario es el investigador del programa
    if programa_original.creado_por != request.user.perfil_investigador:
        return Response(
            {"error": "No tienes permiso para duplicar este programa"},
            status=status.HTTP_403_FORBIDDEN
        )

    try:
        # Crear una copia del programa
        programa_duplicado = Programa.objects.create(
            nombre=f"Copia de {programa_original.nombre}",
            descripcion=programa_original.descripcion,
            tipo_contexto=programa_original.tipo_contexto,
            enfoque_metodologico=programa_original.enfoque_metodologico,
            poblacion_objetivo=programa_original.poblacion_objetivo,
            duracion_semanas=programa_original.duracion_semanas,
            creado_por=request.user.perfil_investigador,
            estado_publicacion=EstadoPublicacion.BORRADOR
        )

        # Copiar las sesiones
        for sesion in programa_original.sesiones.all():
            sesion.pk = None
            sesion.programa = programa_duplicado
            sesion.save()

        # Copiar los cuestionarios si existen
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