from rest_framework import serializers
from .models import Programa, TipoContexto, EnfoqueMetodologico, EstadoPublicacion, ProgramaParticipante, EstadoPrograma
from usuario.serializers import UsuarioSerializer
from sesion.serializers import SesionSerializer
from django.utils import timezone
from cuestionario.serializers import CuestionarioSerializer
from rest_framework.exceptions import ValidationError

class ProgramaParticipanteSerializer(serializers.ModelSerializer):
    fecha_fin = serializers.DateTimeField(read_only=True)
    estado_programa = serializers.ChoiceField(choices=EstadoPrograma.choices, read_only=True)

    class Meta:
        model = ProgramaParticipante
        fields = ['fecha_inicio', 'fecha_fin', 'estado_programa']

class ProgramaSerializer(serializers.ModelSerializer):
    creado_por = UsuarioSerializer(read_only=True)
    participantes = UsuarioSerializer(many=True, read_only=True)
    sesiones = SesionSerializer(many=True, read_only=True)
    inscripcion_info = serializers.SerializerMethodField()
    cuestionario_pre = CuestionarioSerializer(read_only=True)
    cuestionario_post = CuestionarioSerializer(read_only=True)
    tiene_cuestionarios_completos = serializers.SerializerMethodField()
    
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
            'sesiones', 'inscripcion_info',
            'tiene_cuestionarios_completos'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'fecha_publicacion']

    def get_puede_ser_publicado(self, obj):
        return obj.puede_ser_publicado()

    def get_inscripcion_info(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Buscar cualquier inscripción del usuario en este programa
            inscripcion = ProgramaParticipante.objects.filter(
                participante=request.user,
                programa=obj
            ).first()
            
            if inscripcion:
                fecha_inicio = inscripcion.fecha_inicio
                fecha_fin = inscripcion.fecha_fin or (fecha_inicio + timezone.timedelta(weeks=obj.duracion_semanas))
                return {
                    'fecha_inicio': fecha_inicio,
                    'fecha_fin': fecha_fin,
                    'estado_programa': inscripcion.estado_programa,
                    'es_completado': inscripcion.estado_programa == EstadoPrograma.COMPLETADO
                }
        return None

    def get_tiene_cuestionarios_completos(self, obj):
        return obj.cuestionario_pre is not None and obj.cuestionario_post is not None

    def validate_estado_publicacion(self, value):
        if value == EstadoPublicacion.PUBLICADO:
            if not self.instance.puede_ser_publicado():
                raise serializers.ValidationError(
                    "No se puede publicar el programa porque faltan campos requeridos, sesiones o cuestionarios"
                )
        return value
