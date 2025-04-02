from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import ProgramaViewSet

router = DefaultRouter()
router.register(r'', ProgramaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
