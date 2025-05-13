from django.urls import path
from .api import programa_list_create, programa_detail, programa_publicar, programa_enrolar, mi_programa, programa_completar, mis_programas_completados, programa_finalizar
from cuestionario.api import cuestionario_list
from . import api

urlpatterns = [
    path('', programa_list_create, name='programa-list-create'),
    path('<int:pk>/', programa_detail, name='programa-detail'),
    path('<int:pk>/publicar/', programa_publicar, name='programa-publicar'),
    path('<int:pk>/enrolar/', programa_enrolar, name='programa-enrolar'),
    path('<int:pk>/completar/', programa_completar, name='programa-completar'),
    path('mi-programa/', mi_programa, name='mi-programa'),
    path('mis-completados/', mis_programas_completados, name='mis_programas-completados'),
    path('<int:programa_id>/cuestionarios/', cuestionario_list, name='cuestionario-list'),
    path('<int:pk>/finalizar/', programa_finalizar, name='programa_finalizar'),
    path('<int:pk>/inscripciones/', api.programa_inscripciones, name='programa-inscripciones'),
]
