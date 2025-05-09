from django.contrib import admin
from .models import Sesion, DiarioRespuesta

class SesionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'programa', 'semana', 'tipo_practica', 'tipo_contenido')
    list_filter = ('programa', 'tipo_practica', 'tipo_contenido')
    search_fields = ('titulo', 'descripcion')

class DiarioRespuestaAdmin(admin.ModelAdmin):
    list_display = ('participante', 'sesion', 'valoracion', 'fecha_creacion')
    list_filter = ('sesion__programa', 'fecha_creacion')
    search_fields = ('participante__usuario__email', 'sesion__titulo', 'comentario')

admin.site.register(Sesion, SesionAdmin)
admin.site.register(DiarioRespuesta, DiarioRespuestaAdmin)
