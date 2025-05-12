from django.urls import path
from . import api

urlpatterns = [
    # URLs para cuestionarios
    path('<int:cuestionario_id>/', api.cuestionario_detail, name='cuestionario-detail'),

    #path('programa/<int:programa_id>/cuestionarios/', api.obtener_cuestionarios_programa, name='cuestionarios-programa'),

    # Endpoints para obtener cuestionarios
    path('pre/', api.obtener_cuestionario_pre, name='cuestionario-pre'),
    path('post/', api.obtener_cuestionario_post, name='cuestionario-post'),
    
    # Endpoints para responder cuestionarios
    path('responder/pre/', api.responder_cuestionario_pre, name='responder-pre'),
    path('responder/post/', api.responder_cuestionario_post, name='responder-post'),
]
