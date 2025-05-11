from rest_framework import serializers
from .models import Cuestionario, RespuestaCuestionario

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
            
            # Validaciones específicas según el tipo de pregunta
            tipo = pregunta['tipo']
            if tipo in ['select', 'checkbox']:
                if 'opciones' not in pregunta or not isinstance(pregunta['opciones'], list):
                    raise serializers.ValidationError(f"Las preguntas de tipo {tipo} deben tener opciones")
            
            elif tipo == 'likert':
                if 'escala' not in pregunta:
                    raise serializers.ValidationError("Las preguntas Likert deben tener una escala")
                escala = pregunta['escala']
                if not all(k in escala for k in ['inicio', 'fin', 'etiquetas']):
                    raise serializers.ValidationError("La escala Likert debe tener inicio, fin y etiquetas")
            
            elif tipo == 'likert-5-puntos':
                if 'likert5Puntos' not in pregunta:
                    raise serializers.ValidationError("Las preguntas Likert 5 puntos deben tener configuración")
                likert5 = pregunta['likert5Puntos']
                if not all(k in likert5 for k in ['tipo', 'filas']):
                    raise serializers.ValidationError("La configuración Likert 5 puntos debe tener tipo y filas")
            
            elif tipo == 'calificacion':
                if 'estrellas' not in pregunta:
                    raise serializers.ValidationError("Las preguntas de calificación deben tener configuración de estrellas")
                estrellas = pregunta['estrellas']
                if not all(k in estrellas for k in ['cantidad', 'icono']):
                    raise serializers.ValidationError("La configuración de calificación debe tener cantidad e icono")
        
        return value

class RespuestaCuestionarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespuestaCuestionario
        fields = ['id', 'cuestionario', 'usuario', 'respuestas', 'fecha_respuesta']
        read_only_fields = ['fecha_respuesta']

    def validate_respuestas(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Las respuestas deben ser un objeto")
        return value
