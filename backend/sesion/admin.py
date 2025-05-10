from django.contrib import admin
from .models import Sesion, DiarioSesion

class SesionAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'programa', 'semana', 'tipo_practica', 'tipo_contenido', 'tipo_escala')
    list_filter = ('programa', 'tipo_practica', 'tipo_contenido', 'tipo_escala')
    search_fields = ('titulo', 'descripcion')

class DiarioSesionAdmin(admin.ModelAdmin):
    list_display = ('participante', 'sesion', 'valoracion', 'comentario', 'fecha_creacion')
    list_filter = ('sesion__programa', 'fecha_creacion')
    search_fields = ('participante__usuario__email', 'sesion__titulo', 'comentario')

admin.site.register(Sesion, SesionAdmin)
admin.site.register(DiarioSesion, DiarioSesionAdmin)
