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
import zipfile
from io import BytesIO, StringIO
from django.http import HttpResponse
from datetime import datetime

def generar_archivo_participantes(programa, formato):
    """Genera el archivo de participantes en el formato especificado"""
    # Datos de participantes
    participantes_data = []
    inscripciones = InscripcionPrograma.objects.filter(programa=programa).select_related('participante__usuario')
    
    for inscripcion in inscripciones:
        try:
            participante = inscripcion.participante
            usuario = participante.usuario
            
            # Calcular edad si fechaNacimiento está disponible
            edad = None
            if hasattr(usuario, 'fechaNacimiento') and usuario.fechaNacimiento:
                edad = (datetime.now().date() - usuario.fechaNacimiento).days // 365
            
            # Obtener valores display de los enums y convertir a string
            genero_display = str(dict(Genero.choices).get(usuario.genero, usuario.genero)) if hasattr(usuario, 'genero') else 'No especificado'
            nivel_educativo_display = str(dict(NivelEducativo.choices).get(usuario.nivelEducativo, usuario.nivelEducativo)) if hasattr(usuario, 'nivelEducativo') else 'No especificado'
            experiencia_mindfulness_display = str(dict(ExperienciaMindfulness.choices).get(participante.experienciaMindfulness, participante.experienciaMindfulness)) if hasattr(participante, 'experienciaMindfulness') else 'No especificado'
            
            participantes_data.append({
                'id_participante': f"P{participante.id}",
                'genero': genero_display,
                'edad': f"{edad} años" if edad is not None else 'No especificado',
                'ocupacion': str(usuario.ocupacion) if hasattr(usuario, 'ocupacion') and usuario.ocupacion else 'No especificado',
                'nivel_educativo': nivel_educativo_display,
                'ubicacion': str(usuario.ubicacion) if hasattr(usuario, 'ubicacion') and usuario.ubicacion else 'No especificado',
                'experiencia_mindfulness': experiencia_mindfulness_display,
                'condiciones_salud': str(participante.condicionesSalud) if hasattr(participante, 'condicionesSalud') and participante.condicionesSalud else 'No especificado'
            })
        except Exception as e:
            print(f"Error procesando participante {inscripcion.participante.id}: {str(e)}")
            continue
    
    if formato == 'json':
        return json.dumps(participantes_data, ensure_ascii=False).encode('utf-8')
    
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
                participante['id_participante'],
                participante['genero'],
                participante['edad'],
                participante['ocupacion'],
                participante['nivel_educativo'],
                participante['ubicacion'],
                participante['experiencia_mindfulness'],
                participante['condiciones_salud']
            ])
        
        return output.getvalue().encode('utf-8-sig')
    
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
        
        # Escribir datos (asegurándonos de que todos los valores sean strings)
        for row, participante in enumerate(participantes_data, start=1):
            ws_participantes.write(row, 0, str(participante['id_participante']))
            ws_participantes.write(row, 1, str(participante['genero']))
            ws_participantes.write(row, 2, str(participante['edad']))
            ws_participantes.write(row, 3, str(participante['ocupacion']))
            ws_participantes.write(row, 4, str(participante['nivel_educativo']))
            ws_participantes.write(row, 5, str(participante['ubicacion']))
            ws_participantes.write(row, 6, str(participante['experiencia_mindfulness']))
            ws_participantes.write(row, 7, str(participante['condiciones_salud']))
        
        workbook.close()
        return output.getvalue()

def generar_archivo_diarios(programa, formato):
    """Genera el archivo de diarios en el formato especificado"""
    # Obtener todas las sesiones del programa
    sesiones = Sesion.objects.filter(programa=programa).order_by('semana', 'id')
    diarios_data = []
    
    for sesion in sesiones:
        # Obtener los diarios de esta sesión
        diarios = DiarioSesion.objects.filter(
            sesion=sesion
        ).select_related('participante', 'sesion')
        
        for diario in diarios:
            # Obtener valor display del tipo de práctica y convertir a string
            tipo_practica_display = str(dict(EtiquetaPractica.choices).get(sesion.tipo_practica, sesion.tipo_practica))
            
            diarios_data.append({
                'semana': sesion.semana,
                'sesion': str(sesion.titulo),
                'tipo_practica': tipo_practica_display,
                'id_participante': f"P{diario.participante.id}",
                'valoracion': diario.valoracion,
                'comentario': str(diario.comentario) if diario.comentario else 'Sin comentario',
                'fecha': diario.fecha_creacion.strftime('%d/%m/%Y')
            })
    
    if formato == 'json':
        return json.dumps(diarios_data, ensure_ascii=False).encode('utf-8')
    
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
                diario['id_participante'],
                diario['valoracion'],
                diario['comentario'],
                diario['fecha']
            ])
        
        return output.getvalue().encode('utf-8-sig')
    
    elif formato == 'excel':
        output = BytesIO()
        workbook = xlsxwriter.Workbook(output)
        
        # Estilos
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#D9E1F2',
            'border': 1
        })
        
        # Crear hoja
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
        
        # Escribir datos (asegurándonos de que todos los valores sean del tipo correcto)
        for row, diario in enumerate(diarios_data, start=1):
            ws_diarios.write(row, 0, diario['semana'])  # número
            ws_diarios.write(row, 1, str(diario['sesion']))  # string
            ws_diarios.write(row, 2, str(diario['tipo_practica']))  # string
            ws_diarios.write(row, 3, str(diario['id_participante']))  # string
            ws_diarios.write(row, 4, diario['valoracion'])  # número
            ws_diarios.write(row, 5, str(diario['comentario']))  # string
            ws_diarios.write(row, 6, str(diario['fecha']))  # string
        
        workbook.close()
        return output.getvalue()

def generar_archivo_cuestionario(programa, tipo_cuestionario, formato):
    """Genera el archivo de cuestionario (pre o post) en el formato especificado"""
    cuestionario = programa.cuestionario_pre if tipo_cuestionario == 'pre' else programa.cuestionario_post
    
    if not cuestionario:
        return None
    
    # Preparar datos del cuestionario
    preguntas = []
    indices_preguntas = []
    
    for i, p in enumerate(cuestionario.preguntas):
        if p['tipo'] not in ['likert', 'likert-5-puntos']:
            preguntas.append(str(p['texto']))
            indices_preguntas.append(i)
    
    respuestas = RespuestaCuestionario.objects.filter(
        cuestionario=cuestionario
    ).select_related('participante').order_by('participante__id', 'fecha_respuesta')

    # Preparar datos para exportación
    datos = []
    for respuesta in respuestas:
        fila = {'ID Participante': f"P{respuesta.participante.id}"}
        for i, pregunta in enumerate(cuestionario.preguntas):
            if i in indices_preguntas:
                pregunta_id = str(pregunta['id'])
                valor_respuesta = respuesta.respuestas.get(pregunta_id, 'N/A')
                fila[str(pregunta['texto'])] = str(valor_respuesta) if valor_respuesta is not None else 'N/A'
        datos.append(fila)

    if formato == 'json':
        return json.dumps(datos, ensure_ascii=False).encode('utf-8')

    elif formato == 'csv':
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(['ID Participante'] + preguntas)

        for respuesta in respuestas:
            fila = [f"P{respuesta.participante.id}"]
            for i, pregunta in enumerate(cuestionario.preguntas):
                if i in indices_preguntas:
                    pregunta_id = str(pregunta['id'])
                    valor_respuesta = respuesta.respuestas.get(pregunta_id, 'N/A')
                    fila.append(str(valor_respuesta) if valor_respuesta is not None else 'N/A')
            writer.writerow(fila)

        return output.getvalue().encode('utf-8-sig')

    elif formato == 'excel':
        output = BytesIO()
        workbook = xlsxwriter.Workbook(output)
        
        # Estilos
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#D9E1F2',
            'border': 1
        })
        
        # Crear hoja
        nombre_hoja = f'Cuestionario {tipo_cuestionario.title()}'
        ws = workbook.add_worksheet(nombre_hoja)
        
        # Escribir encabezados
        headers = ['ID Participante'] + preguntas
        for col, header in enumerate(headers):
            ws.write(0, col, str(header), header_format)
        
        # Escribir datos (asegurándonos de que todos los valores sean strings)
        for row, respuesta in enumerate(respuestas, start=1):
            ws.write(row, 0, f"P{respuesta.participante.id}")
            col_index = 1
            for i, pregunta in enumerate(cuestionario.preguntas):
                if i in indices_preguntas:
                    pregunta_id = str(pregunta['id'])
                    valor_respuesta = respuesta.respuestas.get(pregunta_id, 'N/A')
                    ws.write(row, col_index, str(valor_respuesta) if valor_respuesta is not None else 'N/A')
                    col_index += 1
        
        workbook.close()
        return output.getvalue()

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
        
        # Obtener extensión del archivo
        extension = 'csv' if formato == 'csv' else 'xlsx' if formato == 'excel' else 'json'
        fecha = datetime.now().strftime('%Y-%m-%d')
        
        if tipo_exportacion == 'todos':
            # Crear ZIP con todos los datos
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # Agregar participantes
                participantes_data = generar_archivo_participantes(programa, formato)
                zip_file.writestr(f'participantes_programa_{programa.id}_{fecha}.{extension}', participantes_data)
                
                # Agregar diarios
                diarios_data = generar_archivo_diarios(programa, formato)
                zip_file.writestr(f'diarios_programa_{programa.id}_{fecha}.{extension}', diarios_data)
                
                # Agregar cuestionario pre si existe
                if programa.cuestionario_pre:
                    cuestionario_pre_data = generar_archivo_cuestionario(programa, 'pre', formato)
                    if cuestionario_pre_data:
                        zip_file.writestr(f'cuestionario_pre_programa_{programa.id}_{fecha}.{extension}', cuestionario_pre_data)
                
                # Agregar cuestionario post si existe
                if programa.cuestionario_post:
                    cuestionario_post_data = generar_archivo_cuestionario(programa, 'post', formato)
                    if cuestionario_post_data:
                        zip_file.writestr(f'cuestionario_post_programa_{programa.id}_{fecha}.{extension}', cuestionario_post_data)
            
            response = HttpResponse(
                zip_buffer.getvalue(),
                content_type='application/zip'
            )
            response['Content-Disposition'] = f'attachment; filename="datos_completos_programa_{programa.id}_{fecha}.zip"'
            return response
        
        elif tipo_exportacion == 'cuestionarios':
            # Crear ZIP solo con cuestionarios
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                # Agregar cuestionario pre si existe
                if programa.cuestionario_pre:
                    cuestionario_pre_data = generar_archivo_cuestionario(programa, 'pre', formato)
                    if cuestionario_pre_data:
                        zip_file.writestr(f'cuestionario_pre_programa_{programa.id}_{fecha}.{extension}', cuestionario_pre_data)
                
                # Agregar cuestionario post si existe
                if programa.cuestionario_post:
                    cuestionario_post_data = generar_archivo_cuestionario(programa, 'post', formato)
                    if cuestionario_post_data:
                        zip_file.writestr(f'cuestionario_post_programa_{programa.id}_{fecha}.{extension}', cuestionario_post_data)
            
            response = HttpResponse(
                zip_buffer.getvalue(),
                content_type='application/zip'
            )
            response['Content-Disposition'] = f'attachment; filename="cuestionarios_programa_{programa.id}_{fecha}.zip"'
            return response

        elif tipo_exportacion == 'participantes':
            # Exportar solo participantes (archivo individual)
            participantes_data = generar_archivo_participantes(programa, formato)
            
            if formato == 'json':
                response = HttpResponse(
                    participantes_data,
                    content_type='application/json'
                )
                response['Content-Disposition'] = f'attachment; filename="participantes_programa_{programa.id}_{fecha}.json"'
                return response
            
            elif formato == 'csv':
                response = HttpResponse(
                    participantes_data,
                    content_type='text/csv; charset=utf-8'
                )
                response['Content-Disposition'] = f'attachment; filename="participantes_programa_{programa.id}_{fecha}.csv"'
                return response
            
            elif formato == 'excel':
                response = HttpResponse(
                    participantes_data,
                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                response['Content-Disposition'] = f'attachment; filename="participantes_programa_{programa.id}_{fecha}.xlsx"'
                return response

        elif tipo_exportacion == 'diarios':
            # Exportar solo diarios (archivo individual)
            diarios_data = generar_archivo_diarios(programa, formato)
            
            if formato == 'json':
                response = HttpResponse(
                    diarios_data,
                    content_type='application/json'
                )
                response['Content-Disposition'] = f'attachment; filename="diarios_programa_{programa.id}_{fecha}.json"'
                return response
            
            elif formato == 'csv':
                response = HttpResponse(
                    diarios_data,
                    content_type='text/csv; charset=utf-8'
                )
                response['Content-Disposition'] = f'attachment; filename="diarios_programa_{programa.id}_{fecha}.csv"'
                return response
            
            elif formato == 'excel':
                response = HttpResponse(
                    diarios_data,
                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                response['Content-Disposition'] = f'attachment; filename="diarios_programa_{programa.id}_{fecha}.xlsx"'
                return response

        else:
            return Response(
                {"error": "Tipo de exportación no válido. Use 'todos', 'cuestionarios', 'diarios' o 'participantes'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            {"error": "Formato no válido. Use 'csv', 'excel' o 'json'"},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception as e:
        print(f"Error al exportar datos: {str(e)}")
        print(traceback.format_exc())
        return Response(
            {"error": "Error interno del servidor al exportar datos"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 