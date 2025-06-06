from django.urls import path
from . import api

# /api/sesiones/
urlpatterns = [
    # Sesiones
    path('', api.sesion_list_create, name='sesion-list-create'),
    path('<int:pk>/', api.sesion_detail, name='sesion-detail'),
    #path('tipos-practica/', api.tipos_practica, name='tipos-practica'),
    #path('tipos-contenido/', api.tipos_contenido, name='tipos-contenido'),
    #path('tipos-escala/', api.tipos_escala, name='tipos-escala'),
    
    # Diarios de sesión
    path('diario/', api.diario_sesion_list_create, name='diario-sesion-list-create'),
    path('diario/<int:pk>/', api.diario_sesion_detail, name='diario-sesion-detail'),
    path('<int:sesion_id>/diario_info/', api.diario_info, name='diario-info'),
]
