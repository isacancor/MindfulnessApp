from rest_framework import serializers
from .models import Cuestionario, RespuestaCuestionario
from usuario.models import Participante
from config.enums import TipoCuestionario, TipoPregunta

class CuestionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuestionario
        fields = ['id', 'programa', 'tipo', 'titulo', 'descripcion', 'preguntas', 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

    def validate_preguntas(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Las preguntas deben ser una lista")
        
        for pregunta in value:
            if not isinstance(pregunta, dict):
                raise serializers.ValidationError("Cada pregunta debe ser un objeto")
            
            required_fields = ['id', 'tipo', 'texto']
            for field in required_fields:
                if field not in pregunta:
                    raise serializers.ValidationError(f"Falta el campo requerido: {field}")
            
            # Validar que el tipo de pregunta sea válido
            tipo = pregunta['tipo']
            if tipo not in [choice[0] for choice in TipoPregunta.choices]:
                raise serializers.ValidationError(f"Tipo de pregunta no válido: {tipo}")
            
            # Validaciones específicas según el tipo de pregunta
            if tipo in [TipoPregunta.SELECT, TipoPregunta.CHECKBOX]:
                if 'opciones' not in pregunta or not isinstance(pregunta['opciones'], list):
                    raise serializers.ValidationError(f"Las preguntas de tipo {tipo} deben tener opciones")
            
            elif tipo == TipoPregunta.LIKERT:
                if 'escala' not in pregunta:
                    raise serializers.ValidationError("Las preguntas Likert deben tener una escala")
                escala = pregunta['escala']
                if not all(k in escala for k in ['inicio', 'fin', 'etiquetas']):
                    raise serializers.ValidationError("La escala Likert debe tener inicio, fin y etiquetas")
            
            elif tipo == TipoPregunta.LIKERT_5_PUNTOS:
                if 'likert5Puntos' not in pregunta:
                    raise serializers.ValidationError("Las preguntas Likert 5 puntos deben tener configuración")
                likert5 = pregunta['likert5Puntos']
                if not all(k in likert5 for k in ['tipo', 'filas']):
                    raise serializers.ValidationError("La configuración Likert 5 puntos debe tener tipo y filas")
            
            elif tipo == TipoPregunta.CALIFICACION:
                if 'estrellas' not in pregunta:
                    raise serializers.ValidationError("Las preguntas de calificación deben tener configuración de estrellas")
                estrellas = pregunta['estrellas']
                if not all(k in estrellas for k in ['cantidad', 'icono']):
                    raise serializers.ValidationError("La configuración de calificación debe tener cantidad e icono")
        
        return value

class RespuestaCuestionarioSerializer(serializers.ModelSerializer):
    participante_nombre = serializers.SerializerMethodField()
    cuestionario_titulo = serializers.SerializerMethodField()

    class Meta:
        model = RespuestaCuestionario
        fields = ['id', 'cuestionario', 'participante', 'participante_nombre', 'cuestionario_titulo', 
                 'respuestas', 'fecha_respuesta']
        read_only_fields = ['fecha_respuesta']

    def get_participante_nombre(self, obj):
        return f"{obj.participante.usuario.nombre} {obj.participante.usuario.apellidos}"

    def get_cuestionario_titulo(self, obj):
        return obj.cuestionario.titulo

    def validate(self, data):
        # Verificar que el participante no haya respondido este cuestionario antes
        if RespuestaCuestionario.objects.filter(
            cuestionario=data['cuestionario'],
            participante=data['participante']
        ).exists():
            raise serializers.ValidationError(
                "Este participante ya ha respondido este cuestionario"
            )
        return data
