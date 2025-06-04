from django.urls import path
from cuestionario.api import cuestionario_list
from . import api

# /api/programa/
urlpatterns = [
    path('', api.programa_list_create, name='programa-list-create'),
    path('<int:pk>/', api.programa_detail, name='programa-detail'),
    path('<int:pk>/duplicar/', api.programa_duplicar, name='programa-duplicar'),
    path('<int:pk>/publicar/', api.programa_publicar, name='programa-publicar'),
    path('<int:pk>/enrolar/', api.programa_enrolar, name='programa-enrolar'),
    path('mi-programa/', api.mi_programa, name='mi-programa'),
    path('mis-completados/', api.mis_programas_completados, name='mis_programas-completados'),
    path('<int:pk>/cuestionarios/', cuestionario_list, name='cuestionario-list'),
    path('<int:pk>/finalizar/', api.programa_finalizar, name='programa_finalizar'),
    path('<int:pk>/inscripciones/', api.programa_inscripciones, name='programa-inscripciones'),
    
    path('estadisticas/', api.investigador_estadisticas, name='investigador-estadisticas'),
    path('<int:pk>/estadisticas/', api.programa_estadisticas, name='programa-estadisticas'),
    path('<int:pk>/exportar/', api.exportar_datos_programa, name='exportar-datos-programa'),
    path('<int:pk>/participantes/', api.listar_participantes_programa, name='listar-participantes-programa'),
    
]
