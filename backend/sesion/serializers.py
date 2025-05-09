from rest_framework import serializers
from .models import Sesion, DiarioRespuesta, EtiquetaPractica, TipoContenido

class EtiquetaPracticaSerializer(serializers.Serializer):
    value = serializers.CharField(source='value')
    label = serializers.CharField(source='label')

class TipoContenidoSerializer(serializers.Serializer):
    value = serializers.CharField(source='value')
    label = serializers.CharField(source='label')

class SesionSerializer(serializers.ModelSerializer):
    tipo_practica_display = serializers.CharField(source='get_tipo_practica_display', read_only=True)
    tipo_contenido_display = serializers.CharField(source='get_tipo_contenido_display', read_only=True)
    programa_nombre = serializers.CharField(source='programa.nombre', read_only=True)
    
    class Meta:
        model = Sesion
        fields = [
            'id', 'programa', 'programa_nombre', 'titulo', 'descripcion',
            'semana', 'duracion_estimada', 'tipo_practica', 'tipo_practica_display',
            'tipo_contenido', 'tipo_contenido_display', 'contenido_temporizador',
            'contenido_url', 'contenido_audio', 'contenido_video'
        ]

        contenido_temporizador = serializers.IntegerField(required=False, allow_null=True)
        contenido_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)
        contenido_audio = serializers.FileField(required=False, allow_null=True)

class SesionDetalleSerializer(serializers.ModelSerializer):
    disponible = serializers.SerializerMethodField()
    
    class Meta:
        model = Sesion
        fields = '__all__'
    
    def get_disponible(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and hasattr(request.user, 'participante'):
            return obj.esta_disponible_para(request.user.participante)
        return False
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tipo_practica_display'] = instance.get_tipo_practica_display()
        representation['tipo_contenido_display'] = instance.get_tipo_contenido_display()
        return representation

class DiarioRespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiarioRespuesta
        fields = '__all__'
        read_only_fields = ['fecha_creacion']
