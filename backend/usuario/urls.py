from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UsuarioViewSet, InvestigadorViewSet, ParticipanteViewSet, verificar_perfil_participante

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'investigadores', InvestigadorViewSet)
router.register(r'participantes', ParticipanteViewSet)

# /api/usuario/
urlpatterns = [
    path('', include(router.urls)),
    path('verificar-perfil-participante/', verificar_perfil_participante, name='verificar-perfil-participante'),
]
