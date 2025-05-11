from django.contrib import admin
from .models import Cuestionario, RespuestaCuestionario

@admin.register(Cuestionario)
class CuestionarioAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'programa', 'tipo', 'fecha_creacion')
    list_filter = ('tipo', 'programa')
    search_fields = ('titulo', 'descripcion')
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')

@admin.register(RespuestaCuestionario)
class RespuestaCuestionarioAdmin(admin.ModelAdmin):
    list_display = ('cuestionario', 'usuario', 'fecha_respuesta')
    list_filter = ('cuestionario', 'usuario')
    search_fields = ('usuario__email', 'cuestionario__titulo')
    readonly_fields = ('fecha_respuesta',)
