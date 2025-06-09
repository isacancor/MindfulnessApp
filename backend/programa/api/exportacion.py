import traceback
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from usuario.permissions import IsInvestigador
from django.shortcuts import get_object_or_404
from ..models import Programa, InscripcionPrograma
from sesion.models import DiarioSesion, Sesion
from cuestionario.models import RespuestaCuestionario
from config.enums import (
    TipoContexto, EnfoqueMetodologico, EstadoPublicacion, 
    EstadoInscripcion, EtiquetaPractica, Genero, NivelEducativo,
    ExperienciaMindfulness
)
import csv
import json
import xlsxwriter
from io import BytesIO, StringIO
from django.http import HttpResponse
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsInvestigador])
def exportar_datos_programa(request, pk):
    """
    Exporta los datos de un programa en el formato especificado (CSV, Excel o JSON).
    Los datos se pueden filtrar por tipo (todos, cuestionarios, diarios, participantes).
    """
    try:
        programa = get_object_or_404(Programa, pk=pk)
        
        # Verificar que el programa pertenece al investigador actual
        if programa.creado_por != request.user.perfil_investigador:
            return Response(
                {"error": "No tienes permiso para exportar datos de este programa"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Obtener parámetros de la solicitud
        tipo_exportacion = request.GET.get('tipo', 'todos')
        formato = request.GET.get('formato', 'csv')
        
        print(f"Iniciando exportación - Tipo: {tipo_exportacion}, Formato: {formato}, Programa ID: {pk}")
        
        # Preparar datos según el tipo de exportación
        datos = {}
        
        if tipo_exportacion in ['todos', 'participantes']:
            try:
                # Datos de participantes
                participantes_data = []
                inscripciones = InscripcionPrograma.objects.filter(programa=programa).select_related('participante__usuario')
                
                print(f"Procesando {inscripciones.count()} inscripciones")
                
                for inscripcion in inscripciones:
                    try:
                        participante = inscripcion.participante
                        usuario = participante.usuario
                        
                        # Calcular edad si fechaNacimiento está disponible
                        edad = None
                        if hasattr(usuario, 'fechaNacimiento') and usuario.fechaNacimiento:
                            edad = (datetime.now().date() - usuario.fechaNacimiento).days // 365
                        
                        # Obtener valores display de los enums
                        genero_display = dict(Genero.choices).get(usuario.genero, usuario.genero) if hasattr(usuario, 'genero') else 'No especificado'
                        nivel_educativo_display = dict(NivelEducativo.choices).get(usuario.nivelEducativo, usuario.nivelEducativo) if hasattr(usuario, 'nivelEducativo') else 'No especificado'
                        experiencia_mindfulness_display = dict(ExperienciaMindfulness.choices).get(participante.experienciaMindfulness, participante.experienciaMindfulness) if hasattr(participante, 'experienciaMindfulness') else 'No especificado'
                        
                        participantes_data.append({
                            'id_anonimo': f"P{participante.id}",
                            'genero': genero_display,
                            'edad': f"{edad} años" if edad is not None else 'No especificado',
                            'ocupacion': usuario.ocupacion if hasattr(usuario, 'ocupacion') else 'No especificado',
                            'nivel_educativo': nivel_educativo_display,
                            'ubicacion': usuario.ubicacion if hasattr(usuario, 'ubicacion') else 'No especificado',
                            'experiencia_mindfulness': experiencia_mindfulness_display,
                            'condiciones_salud': participante.condicionesSalud if hasattr(participante, 'condicionesSalud') else 'No especificado'
                        })
                    except Exception as e:
                        print(f"Error procesando participante {inscripcion.participante.id}: {str(e)}")
                        print(traceback.format_exc())
                        continue
                
                datos['participantes'] = participantes_data
            except Exception as e:
                print(f"Error procesando datos de participantes: {str(e)}")
                print(traceback.format_exc())
                raise

            # Crear respuesta HTTP para datos de participantes
            if formato == 'json':
                response = HttpResponse(
                    json.dumps(participantes_data, ensure_ascii=False),
                    content_type='application/json'
                )
                response['Content-Disposition'] = f'attachment; filename="participantes_programa_{programa.id}.json"'
                return response
            
            elif formato == 'csv':
                output = StringIO()
                writer = csv.writer(output)
                
                # Escribir encabezados
                writer.writerow([
                    'ID Participante',
                    'Género',
                    'Edad',
                    'Ocupación',
                    'Nivel Educativo',
                    'Ubicación',
                    'Experiencia Mindfulness',
                    'Condiciones de Salud'
                ])
                
                # Escribir datos
                for participante in participantes_data:
                    writer.writerow([
                        participante['id_anonimo'],
                        participante['genero'],
                        participante['edad'],
                        participante['ocupacion'],
                        participante['nivel_educativo'],
                        participante['ubicacion'],
                        participante['experiencia_mindfulness'],
                        participante['condiciones_salud']
                    ])
                
                response = HttpResponse(
                    output.getvalue().encode('utf-8-sig'),
                    content_type='text/csv; charset=utf-8'
                )
                response['Content-Disposition'] = f'attachment; filename="participantes_programa_{programa.id}.csv"'
                return response
            
            elif formato == 'excel':
                output = BytesIO()
                workbook = xlsxwriter.Workbook(output)
                
                # Estilos
                header_format = workbook.add_format({
                    'bold': True,
                    'bg_color': '#D9E1F2',
                    'border': 1
                })
                
                # Crear hoja de participantes
                ws_participantes = workbook.add_worksheet('Participantes')
                headers = [
                    'ID Participante',
                    'Género',
                    'Edad',
                    'Ocupación',
                    'Nivel Educativo',
                    'Ubicación',
                    'Experiencia Mindfulness',
                    'Condiciones de Salud'
                ]
                
                # Escribir encabezados
                for col, header in enumerate(headers):
                    ws_participantes.write(0, col, header, header_format)
                
                # Escribir datos
                for row, participante in enumerate(participantes_data, start=1):
                    ws_participantes.write(row, 0, participante['id_anonimo'])
                    ws_participantes.write(row, 1, participante['genero'])
                    ws_participantes.write(row, 2, participante['edad'])
                    ws_participantes.write(row, 3, participante['ocupacion'])
                    ws_participantes.write(row, 4, participante['nivel_educativo'])
                    ws_participantes.write(row, 5, participante['ubicacion'])
                    ws_participantes.write(row, 6, participante['experiencia_mindfulness'])
                    ws_participantes.write(row, 7, participante['condiciones_salud'])
                
                workbook.close()
                response = HttpResponse(
                    output.getvalue(),
                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                response['Content-Disposition'] = f'attachment; filename="participantes_programa_{programa.id}.xlsx"'
                return response
            
            return Response(
                {"error": "Formato no válido. Use 'csv', 'excel' o 'json'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if tipo_exportacion in ['todos', 'diarios']:
            # Obtener todas las sesiones del programa
            sesiones = Sesion.objects.filter(programa=programa).order_by('semana', 'id')
            diarios_data = []
            
            for sesion in sesiones:
                # Obtener los diarios de esta sesión
                diarios = DiarioSesion.objects.filter(
                    sesion=sesion
                ).select_related('participante', 'sesion')
                
                for diario in diarios:
                    # Obtener valor display del tipo de práctica
                    tipo_practica_display = dict(EtiquetaPractica.choices).get(sesion.tipo_practica, sesion.tipo_practica)
                    
                    diarios_data.append({
                        'semana': sesion.semana,
                        'sesion': sesion.titulo,
                        'tipo_practica': tipo_practica_display,
                        'participante_id': f"P{diario.participante.id}",
                        'valoracion': diario.valoracion,
                        'comentario': diario.comentario or 'Sin comentario',
                        'fecha': diario.fecha_creacion.strftime('%d/%m/%Y')
                    })
            
            if formato == 'json':
                response = HttpResponse(
                    json.dumps(diarios_data, ensure_ascii=False),
                    content_type='application/json'
                )
                response['Content-Disposition'] = f'attachment; filename="diarios_programa_{programa.id}.json"'
                return response
            
            elif formato == 'csv':
                output = StringIO()
                writer = csv.writer(output)
                
                # Escribir encabezados
                writer.writerow([
                    'Semana',
                    'Sesión',
                    'Tipo de Práctica',
                    'ID Participante',
                    'Valoración',
                    'Comentario',
                    'Fecha'
                ])
                
                # Escribir datos
                for diario in diarios_data:
                    writer.writerow([
                        diario['semana'],
                        diario['sesion'],
                        diario['tipo_practica'],
                        diario['participante_id'],
                        diario['valoracion'],
                        diario['comentario'],
                        diario['fecha']
                    ])
                
                response = HttpResponse(
                    output.getvalue().encode('utf-8-sig'),
                    content_type='text/csv; charset=utf-8'
                )
                response['Content-Disposition'] = f'attachment; filename="diarios_programa_{programa.id}.csv"'
                return response
            
            elif formato == 'excel':
                output = BytesIO()
                workbook = xlsxwriter.Workbook(output)
                
                # Estilos
                header_format = workbook.add_format({
                    'bold': True,
                    'bg_color': '#D9E1F2',
                    'border': 1
                })
                
                # Crear hoja de diarios
                ws_diarios = workbook.add_worksheet('Diarios')
                headers = [
                    'Semana',
                    'Sesión',
                    'Tipo de Práctica',
                    'ID Participante',
                    'Valoración',
                    'Comentario',
                    'Fecha'
                ]
                
                # Escribir encabezados
                for col, header in enumerate(headers):
                    ws_diarios.write(0, col, header, header_format)
                
                # Escribir datos
                for row, diario in enumerate(diarios_data, start=1):
                    ws_diarios.write(row, 0, diario['semana'])
                    ws_diarios.write(row, 1, diario['sesion'])
                    ws_diarios.write(row, 2, diario['tipo_practica'])
                    ws_diarios.write(row, 3, diario['participante_id'])
                    ws_diarios.write(row, 4, diario['valoracion'])
                    ws_diarios.write(row, 5, diario['comentario'])
                    ws_diarios.write(row, 6, diario['fecha'])
                
                workbook.close()
                response = HttpResponse(
                    output.getvalue(),
                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                response['Content-Disposition'] = f'attachment; filename="diarios_programa_{programa.id}.xlsx"'
                return response
            
            return Response(
                {"error": "Formato no válido. Use 'csv', 'excel' o 'json'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if tipo_exportacion in ['todos', 'cuestionarios']:
            # Obtener el subtipo (pre o post)
            subtipo = request.GET.get('subtipo', 'pre')
            
            if subtipo == 'pre' and programa.cuestionario_pre:
                # Preparar datos del cuestionario pre
                preguntas_pre = []
                indices_preguntas_pre = []
                
                for i, p in enumerate(programa.cuestionario_pre.preguntas):
                    if p['tipo'] not in ['likert', 'likert-5-puntos']:
                        preguntas_pre.append(p['texto'])
                        indices_preguntas_pre.append(i)
                
                respuestas_pre = RespuestaCuestionario.objects.filter(
                    cuestionario=programa.cuestionario_pre
                ).select_related('participante').order_by('participante__id', 'fecha_respuesta')

                # Preparar datos para exportación
                datos_pre = []
                for respuesta in respuestas_pre:
                    fila = {'ID Participante': f"P{respuesta.participante.id}"}
                    for i, pregunta in enumerate(programa.cuestionario_pre.preguntas):
                        if i in indices_preguntas_pre:
                            pregunta_id = str(pregunta['id'])
                            fila[pregunta['texto']] = respuesta.respuestas.get(pregunta_id, 'N/A')
                    datos_pre.append(fila)

                if formato == 'json':
                    response_pre = HttpResponse(
                        json.dumps(datos_pre, ensure_ascii=False),
                        content_type='application/json'
                    )
                    response_pre['Content-Disposition'] = f'attachment; filename="cuestionario_pre_{programa.id}.json"'
                    return response_pre

                elif formato == 'csv':
                    output_pre = StringIO()
                    writer_pre = csv.writer(output_pre)
                    writer_pre.writerow(['ID Participante'] + preguntas_pre)

                    for respuesta in respuestas_pre:
                        fila = [f"P{respuesta.participante.id}"]
                        for i, pregunta in enumerate(programa.cuestionario_pre.preguntas):
                            if i in indices_preguntas_pre:
                                pregunta_id = str(pregunta['id'])
                                fila.append(respuesta.respuestas.get(pregunta_id, 'N/A'))
                        writer_pre.writerow(fila)

                    response_pre = HttpResponse(
                        output_pre.getvalue().encode('utf-8-sig'),
                        content_type='text/csv'
                    )
                    response_pre['Content-Disposition'] = f'attachment; filename="cuestionario_pre_{programa.id}.csv"'
                    return response_pre

                elif formato == 'excel':
                    output_pre = BytesIO()
                    workbook = xlsxwriter.Workbook(output_pre)
                    
                    # Estilos
                    header_format = workbook.add_format({
                        'bold': True,
                        'bg_color': '#D9E1F2',
                        'border': 1
                    })
                    
                    # Crear hoja
                    ws_pre = workbook.add_worksheet('Cuestionario Pre')
                    
                    # Escribir encabezados
                    headers = ['ID Participante'] + preguntas_pre
                    for col, header in enumerate(headers):
                        ws_pre.write(0, col, header, header_format)
                    
                    # Escribir datos
                    for row, respuesta in enumerate(respuestas_pre, start=1):
                        ws_pre.write(row, 0, f"P{respuesta.participante.id}")
                        for i, pregunta in enumerate(programa.cuestionario_pre.preguntas):
                            if i in indices_preguntas_pre:
                                pregunta_id = str(pregunta['id'])
                                ws_pre.write(row, i + 1, respuesta.respuestas.get(pregunta_id, 'N/A'))
                    
                    workbook.close()
                    response_pre = HttpResponse(
                        output_pre.getvalue(),
                        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    )
                    response_pre['Content-Disposition'] = f'attachment; filename="cuestionario_pre_{programa.id}.xlsx"'
                    return response_pre

            elif subtipo == 'post' and programa.cuestionario_post:
                # Preparar datos del cuestionario post
                preguntas_post = []
                indices_preguntas_post = []
                
                for i, p in enumerate(programa.cuestionario_post.preguntas):
                    if p['tipo'] not in ['likert', 'likert-5-puntos']:
                        preguntas_post.append(p['texto'])
                        indices_preguntas_post.append(i)
                
                respuestas_post = RespuestaCuestionario.objects.filter(
                    cuestionario=programa.cuestionario_post
                ).select_related('participante').order_by('participante__id', 'fecha_respuesta')

                # Preparar datos para exportación
                datos_post = []
                for respuesta in respuestas_post:
                    fila = {'ID Participante': f"P{respuesta.participante.id}"}
                    for i, pregunta in enumerate(programa.cuestionario_post.preguntas):
                        if i in indices_preguntas_post:
                            pregunta_id = str(pregunta['id'])
                            fila[pregunta['texto']] = respuesta.respuestas.get(pregunta_id, 'N/A')
                    datos_post.append(fila)

                if formato == 'json':
                    response_post = HttpResponse(
                        json.dumps(datos_post, ensure_ascii=False),
                        content_type='application/json'
                    )
                    response_post['Content-Disposition'] = f'attachment; filename="cuestionario_post_{programa.id}.json"'
                    return response_post

                elif formato == 'csv':
                    output_post = StringIO()
                    writer_post = csv.writer(output_post)
                    writer_post.writerow(['ID Participante'] + preguntas_post)

                    for respuesta in respuestas_post:
                        fila = [f"P{respuesta.participante.id}"]
                        for i, pregunta in enumerate(programa.cuestionario_post.preguntas):
                            if i in indices_preguntas_post:
                                pregunta_id = str(pregunta['id'])
                                fila.append(respuesta.respuestas.get(pregunta_id, 'N/A'))
                        writer_post.writerow(fila)

                    response_post = HttpResponse(
                        output_post.getvalue().encode('utf-8-sig'),
                        content_type='text/csv'
                    )
                    response_post['Content-Disposition'] = f'attachment; filename="cuestionario_post_{programa.id}.csv"'
                    return response_post

                elif formato == 'excel':
                    output_post = BytesIO()
                    workbook = xlsxwriter.Workbook(output_post)
                    
                    # Estilos
                    header_format = workbook.add_format({
                        'bold': True,
                        'bg_color': '#D9E1F2',
                        'border': 1
                    })
                    
                    # Crear hoja
                    ws_post = workbook.add_worksheet('Cuestionario Post')
                    
                    # Escribir encabezados
                    headers = ['ID Participante'] + preguntas_post
                    for col, header in enumerate(headers):
                        ws_post.write(0, col, header, header_format)
                    
                    # Escribir datos
                    for row, respuesta in enumerate(respuestas_post, start=1):
                        ws_post.write(row, 0, f"P{respuesta.participante.id}")
                        for i, pregunta in enumerate(programa.cuestionario_post.preguntas):
                            if i in indices_preguntas_post:
                                pregunta_id = str(pregunta['id'])
                                ws_post.write(row, i + 1, respuesta.respuestas.get(pregunta_id, 'N/A'))
                    
                    workbook.close()
                    response_post = HttpResponse(
                        output_post.getvalue(),
                        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    )
                    response_post['Content-Disposition'] = f'attachment; filename="cuestionario_post_{programa.id}.xlsx"'
                    return response_post

            else:
                return Response(
                    {"error": f"No se encontró el cuestionario {subtipo} para este programa"},
                    status=status.HTTP_404_NOT_FOUND
                )
            
    except Programa.DoesNotExist:
        return Response(
            {"error": "El programa no existe"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error al exportar datos: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {"error": f"Error al exportar datos: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 