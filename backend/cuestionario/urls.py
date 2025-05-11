from django.urls import path
from .api import cuestionario_list, cuestionario_detail, respuesta_list, respuesta_detail


urlpatterns = [
    # URLs para cuestionarios
    path('programas/<int:programa_id>/cuestionarios/', cuestionario_list, name='cuestionario-list'),
    path('cuestionarios/<int:cuestionario_id>/', cuestionario_detail, name='cuestionario-detail'),
    
    # URLs para respuestas
    path('cuestionarios/<int:cuestionario_id>/respuestas/', respuesta_list, name='respuesta-list'),
    path('respuestas/<int:respuesta_id>/', respuesta_detail, name='respuesta-detail'),
]
