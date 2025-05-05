from django.urls import path
from .api import programa_list_create, programa_detail, programa_participantes, programa_publicar, programa_enrolar, mi_programa

urlpatterns = [
    path('', programa_list_create, name='programa-list-create'),
    path('<int:pk>/', programa_detail, name='programa-detail'),
    path('<int:pk>/participantes/', programa_participantes, name='programa-participantes'),
    path('<int:pk>/publicar/', programa_publicar, name='programa-publicar'),
    path('<int:pk>/enrolar/', programa_enrolar, name='programa-enrolar'),
    path('mi-programa/', mi_programa, name='mi-programa'),
]
