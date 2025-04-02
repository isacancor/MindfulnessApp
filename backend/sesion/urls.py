from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api import SesionViewSet

router = DefaultRouter()
router.register(r'', SesionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
