from django.urls import path
from . import api

urlpatterns = [
    # Sesiones
    path('', api.sesion_list_create, name='sesion-list-create'),
    path('<int:pk>/', api.sesion_detail, name='sesion-detail'),
    path('tipos-practica/', api.tipos_practica, name='tipos-practica'),
    path('tipos-contenido/', api.tipos_contenido, name='tipos-contenido'),
    
    # Diarios de respuesta
    path('diarios/', api.diario_respuesta_list_create, name='diario-respuesta-list-create'),
    path('diarios/<int:pk>/', api.diario_respuesta_detail, name='diario-respuesta-detail'),
]
