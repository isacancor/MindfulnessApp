from rest_framework import serializers
from .models import Programa, TipoContexto, EnfoqueMetodologico, Escala, EstadoPublicacion
from usuario.serializers import UsuarioSerializer

class ProgramaSerializer(serializers.ModelSerializer):
    creado_por = UsuarioSerializer(read_only=True)
    participantes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    tipo_contexto = serializers.ChoiceField(choices=TipoContexto.choices)
    enfoque_metodologico = serializers.ChoiceField(choices=EnfoqueMetodologico.choices)
    escala = serializers.ChoiceField(choices=Escala.choices)
    estado_publicacion = serializers.ChoiceField(choices=EstadoPublicacion.choices)
    puede_ser_publicado = serializers.SerializerMethodField()
    
    class Meta:
        model = Programa
        fields = [
            'id', 'nombre', 'descripcion',
            'tipo_contexto', 'enfoque_metodologico',
            'poblacion_objetivo', 'duracion_semanas',
            'cuestionario_pre', 'cuestionario_post',
            'escala', 'estado_publicacion', 'creado_por', 'participantes',
            'fecha_creacion', 'fecha_actualizacion', 'fecha_publicacion', 'puede_ser_publicado'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'fecha_publicacion']

    def get_puede_ser_publicado(self, obj):
        return obj.puede_ser_publicado()

    def validate_estado_publicacion(self, value):
        if value == EstadoPublicacion.PUBLICADO:
            if not self.instance.puede_ser_publicado():
                raise serializers.ValidationError("No se puede publicar el programa porque faltan campos requeridos")
        return value
