from rest_framework import serializers
from .models import Sesion, DiarioSesion
from usuario.serializers import ParticipanteSerializer
from config.enums import EtiquetaPractica, TipoContenido, Escala

class EtiquetaPracticaSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

class TipoContenidoSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

class EscalaSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

class SesionSerializer(serializers.ModelSerializer):
    programa_nombre = serializers.CharField(source='programa.nombre', read_only=True)
    tipo_practica_display = serializers.CharField(source='get_tipo_practica_display', read_only=True)
    tipo_contenido_display = serializers.CharField(source='get_tipo_contenido_display', read_only=True)
    tipo_escala_display = serializers.CharField(source='get_tipo_escala_display', read_only=True)
    tipo_escala = serializers.ChoiceField(choices=Escala.choices, required=False, allow_null=True)

    class Meta:
        model = Sesion
        fields = [
            'id', 'programa', 'programa_nombre', 'titulo', 'descripcion', 'semana',
            'duracion_estimada', 'tipo_practica', 'tipo_practica_display',
            'tipo_contenido', 'tipo_contenido_display', 'tipo_escala', 'tipo_escala_display',
            'contenido_temporizador', 'contenido_url', 'contenido_audio', 'contenido_video',
            'video_fondo'
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
        if request and hasattr(request, 'user') and request.user.is_participante():
            return obj.esta_disponible_para(request.user)
        return False
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tipo_practica_display'] = instance.get_tipo_practica_display()
        representation['tipo_contenido_display'] = instance.get_tipo_contenido_display()
        representation['tipo_escala_display'] = instance.get_tipo_escala_display()
        representation['tipo_escala'] = instance.tipo_escala
        return representation

class DiarioSesionSerializer(serializers.ModelSerializer):
    participante = ParticipanteSerializer(read_only=True)
    sesion = SesionSerializer(read_only=True)
    sesion_id = serializers.PrimaryKeyRelatedField(
        queryset=Sesion.objects.all(),
        source='sesion',
        write_only=True,
        required=False
    )

    class Meta:
        model = DiarioSesion
        fields = ['id', 'participante', 'sesion', 'sesion_id', 'valoracion', 'comentario', 'fecha_creacion']
        read_only_fields = ['participante', 'fecha_creacion']

    def create(self, validated_data):
        return super().create(validated_data)
