from django.urls import path
from .api import programa_list_create, programa_detail, programa_participantes, programa_publicar, programa_enrolar, mi_programa, programa_completar
from cuestionario.api import cuestionario_list

urlpatterns = [
    path('', programa_list_create, name='programa-list-create'),
    path('<int:pk>/', programa_detail, name='programa-detail'),
    path('<int:pk>/participantes/', programa_participantes, name='programa-participantes'),
    path('<int:pk>/publicar/', programa_publicar, name='programa-publicar'),
    path('<int:pk>/enrolar/', programa_enrolar, name='programa-enrolar'),
    path('<int:pk>/completar/', programa_completar, name='programa-completar'),
    path('mi-programa/', mi_programa, name='mi-programa'),
    path('<int:programa_id>/cuestionarios/', cuestionario_list, name='cuestionario-list'),
]
