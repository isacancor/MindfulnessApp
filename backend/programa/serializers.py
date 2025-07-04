from rest_framework import serializers
from .models import Programa, InscripcionPrograma
from usuario.serializers import ParticipanteSerializer, InvestigadorSerializer, UsuarioSerializer
from sesion.serializers import SesionSerializer
from django.utils import timezone
from cuestionario.serializers import CuestionarioSerializer
from rest_framework.exceptions import ValidationError
from config.enums import TipoContexto, EnfoqueMetodologico, EstadoPublicacion, EstadoInscripcion

class InscripcionProgramaSerializer(serializers.ModelSerializer):
    participante = ParticipanteSerializer(read_only=True)
    fecha_fin = serializers.DateTimeField(read_only=True)
    estado_inscripcion = serializers.ChoiceField(choices=EstadoInscripcion.choices, read_only=True)
    estado_inscripcion_display = serializers.CharField(source='get_estado_inscripcion_display', read_only=True)

    class Meta:
        model = InscripcionPrograma
        fields = ['participante', 'fecha_inicio', 'fecha_fin', 'estado_inscripcion', 'estado_inscripcion_display']

class ProgramaSerializer(serializers.ModelSerializer):
    creado_por = InvestigadorSerializer(read_only=True)
    participantes = ParticipanteSerializer(many=True, read_only=True)
    sesiones = SesionSerializer(many=True, read_only=True)
    inscripcion_info = serializers.SerializerMethodField()
    cuestionario_pre = CuestionarioSerializer(read_only=True)
    cuestionario_post = CuestionarioSerializer(read_only=True)
    tiene_cuestionarios_completos = serializers.SerializerMethodField()
    
    tipo_contexto = serializers.ChoiceField(choices=TipoContexto.choices)
    tipo_contexto_display = serializers.CharField(source='get_tipo_contexto_display', read_only=True)
    enfoque_metodologico = serializers.ChoiceField(choices=EnfoqueMetodologico.choices)
    enfoque_metodologico_display = serializers.CharField(source='get_enfoque_metodologico_display', read_only=True)
    estado_publicacion = serializers.ChoiceField(choices=EstadoPublicacion.choices)
    estado_publicacion_display = serializers.CharField(source='get_estado_publicacion_display', read_only=True)
    puede_ser_publicado = serializers.SerializerMethodField()
    
    class Meta:
        model = Programa
        fields = [
            'id', 'nombre', 'descripcion',
            'tipo_contexto', 'tipo_contexto_display',
            'enfoque_metodologico', 'enfoque_metodologico_display',
            'poblacion_objetivo', 'duracion_semanas',
            'tiene_cuestionarios', 'tiene_diarios',
            'cuestionario_pre', 'cuestionario_post',
            'estado_publicacion', 'estado_publicacion_display',
            'creado_por', 'participantes',
            'fecha_creacion', 'fecha_actualizacion', 'fecha_publicacion', 'puede_ser_publicado',
            'sesiones', 'inscripcion_info',
            'tiene_cuestionarios_completos'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion', 'fecha_publicacion']

    def get_puede_ser_publicado(self, obj):
        return obj.puede_ser_publicado()

    def get_inscripcion_info(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'perfil_participante'):
            # Buscar cualquier inscripción del usuario en este programa
            inscripcion = InscripcionPrograma.objects.filter(
                participante=request.user.perfil_participante,
                programa=obj
            ).first()
            
            if inscripcion:
                fecha_inicio = inscripcion.fecha_inicio
                fecha_fin = inscripcion.fecha_fin or (fecha_inicio + timezone.timedelta(weeks=obj.duracion_semanas))
                return {
                    'fecha_inicio': fecha_inicio,
                    'fecha_fin': fecha_fin,
                    'estado_inscripcion': inscripcion.estado_inscripcion,
                    'es_completado': inscripcion.estado_inscripcion == EstadoInscripcion.COMPLETADO
                }
        return None

    def get_tiene_cuestionarios_completos(self, obj):
        return obj.cuestionario_pre is not None and obj.cuestionario_post is not None

    def validate_estado_publicacion(self, value):
        if value == EstadoPublicacion.PUBLICADO:
            # Solo validar si estamos actualizando un programa existente
            if self.instance and not self.instance.puede_ser_publicado():
                raise serializers.ValidationError(
                    "No se puede publicar el programa porque faltan campos requeridos, sesiones o cuestionarios"
                )
        return value

class ParticipantesProgramaSerializer(serializers.ModelSerializer):
    participantes = serializers.SerializerMethodField()

    class Meta:
        model = Programa
        fields = ['id', 'nombre', 'participantes']

    def get_participantes(self, obj):
        # Obtenemos los usuarios asociados a los participantes del programa
        usuarios = [participante.usuario for participante in obj.participantes.all()]
        return UsuarioSerializer(usuarios, many=True).data
