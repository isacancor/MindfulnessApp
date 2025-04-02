from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import UsuarioViewSet, InvestigadorViewSet, ParticipanteViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'investigadores', InvestigadorViewSet)
router.register(r'participantes', ParticipanteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
