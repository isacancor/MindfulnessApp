from rest_framework import serializers
from .models import Programa, TipoContexto, EnfoqueMetodologico, Escala
from usuario.serializers import InvestigadorSerializer

class ProgramaSerializer(serializers.ModelSerializer):
    creado_por = InvestigadorSerializer(read_only=True)
    participantes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    
    tipo_contexto = serializers.ChoiceField(choices=TipoContexto.choices)
    enfoque_metodologico = serializers.ChoiceField(choices=EnfoqueMetodologico.choices)
    escala = serializers.ChoiceField(choices=Escala.choices)
    
    class Meta:
        model = Programa
        fields = [
            'id', 'nombre', 'descripcion',
            'tipo_contexto', 'enfoque_metodologico',
            'poblacion_objetivo', 'duracion_semanas',
            'cuestionario_pre', 'cuestionario_post',
            'escala', 'creado_por', 'participantes',
            'fecha_creacion', 'fecha_actualizacion'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']
