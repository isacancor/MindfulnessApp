from rest_framework import serializers
from .models import Programa, TipoContexto, EnfoqueMetodologico, EstadoPublicacion, ProgramaParticipante, EstadoPrograma
from usuario.serializers import UsuarioSerializer, ParticipanteSerializer
from sesion.serializers import SesionSerializer
from django.utils import timezone

class ProgramaParticipanteSerializer(serializers.ModelSerializer):
    fecha_fin = serializers.DateTimeField(read_only=True)
    estado_programa = serializers.ChoiceField(choices=EstadoPrograma.choices, read_only=True)

    class Meta:
        model = ProgramaParticipante
        fields = ['fecha_inicio', 'fecha_fin', 'estado_programa']

class ProgramaSerializer(serializers.ModelSerializer):
    creado_por = UsuarioSerializer(read_only=True)
    participantes = ParticipanteSerializer(many=True, read_only=True)
    sesiones = SesionSerializer(many=True, read_only=True)
    inscripcion_info = serializers.SerializerMethodField()
    
    tipo_contexto = serializers.ChoiceField(choices=TipoContexto.choices)
    enfoque_metodologico = serializers.ChoiceField(choices=EnfoqueMetodologico.choices)
    estado_publicacion = serializers.ChoiceField(choices=EstadoPublicacion.choices)
    puede_ser_publicado = serializers.SerializerMethodField()
    
    class Meta:
        model = Programa
        fields = [
            'id', 'nombre', 'descripcion',
            'tipo_contexto', 'enfoque_metodologico',
            'poblacion_objetivo', 'duracion_semanas',
            'cuestionario_pre', 'cuestionario_post',
            'estado_publicacion', 'creado_por', 'participantes',
            'fecha_creacion', 'fecha_actualizacion', 'fecha_publicacion', 'puede_ser_publicado',
            'sesiones', 'inscripcion_info'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'fecha_publicacion']

    def get_puede_ser_publicado(self, obj):
        return obj.puede_ser_publicado()

    def get_inscripcion_info(self, obj):
        request = self.context.get('request')
        if request and hasattr(request.user, 'perfil_participante'):
            inscripcion = ProgramaParticipante.objects.filter(
                participante=request.user.perfil_participante,
                programa=obj,
                estado_programa=EstadoPrograma.EN_PROGRESO
            ).first()
            
            if inscripcion:
                fecha_inicio = inscripcion.fecha_inicio
                fecha_fin = inscripcion.fecha_fin or (fecha_inicio + timezone.timedelta(weeks=obj.duracion_semanas))
                return {
                    'fecha_inicio': fecha_inicio,
                    'fecha_fin': fecha_fin,
                    'estado_programa': inscripcion.estado_programa
                }
        return None

    def validate_estado_publicacion(self, value):
        if value == EstadoPublicacion.PUBLICADO:
            if not self.instance.puede_ser_publicado():
                raise serializers.ValidationError("No se puede publicar el programa porque faltan campos requeridos")
        return value
