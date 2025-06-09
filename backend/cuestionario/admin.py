from django.contrib import admin
from .models import Cuestionario, RespuestaCuestionario

@admin.register(Cuestionario)
class CuestionarioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'programa', 'momento', 'fecha_creacion')
    list_filter = ('momento', 'programa')
    search_fields = ('titulo', 'descripcion')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')

@admin.register(RespuestaCuestionario)
class RespuestaCuestionarioAdmin(admin.ModelAdmin):
    list_display = ('cuestionario', 'participante', 'fecha_respuesta')
    list_filter = ('cuestionario', 'participante')
    search_fields = ('cuestionario__titulo', 'participante__email')
    readonly_fields = ('fecha_respuesta',)
