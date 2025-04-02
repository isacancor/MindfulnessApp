from rest_framework import viewsets
from .models import Sesion
from .serializers import SesionSerializer

class SesionViewSet(viewsets.ModelViewSet):
    queryset = Sesion.objects.all()
    serializer_class = SesionSerializer
