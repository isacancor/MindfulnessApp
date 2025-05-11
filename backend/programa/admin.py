from django.contrib import admin
from .models import Programa, ProgramaParticipante

@admin.register(Programa)
class ProgramaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'tipo_contexto', 'enfoque_metodologico', 'duracion_semanas', 'creado_por', 'fecha_creacion')
    list_filter = ('tipo_contexto', 'enfoque_metodologico', 'creado_por')
    search_fields = ('nombre', 'descripcion', 'poblacion_objetivo')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
    filter_horizontal = ('participantes',)

@admin.register(ProgramaParticipante)
class ProgramaParticipanteAdmin(admin.ModelAdmin):
    list_display = ('programa', 'participante', 'fecha_inicio', 'fecha_fin', 'estado_programa')
    list_filter = ('estado_programa', 'fecha_inicio')
    search_fields = ('programa__nombre', 'participante__usuario__email')
