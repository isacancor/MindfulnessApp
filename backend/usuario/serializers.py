from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Usuario, Investigador, Participante
from config.enums import Genero, NivelEducativo, ExperienciaMindfulness, ExperienciaInvestigacion
import django.db.utils

class InvestigadorSerializer(serializers.ModelSerializer):
    nombre_completo_investigador = serializers.SerializerMethodField()

    class Meta:
        model = Investigador
        fields = ['id', 'usuario', 'experienciaInvestigacion', 'areasInteres', 'programas', 'nombre_completo_investigador']

    def get_nombre_completo_investigador(self, obj):
        if obj.usuario:
            return f"{obj.usuario.nombre} {obj.usuario.apellidos}".strip()
        return None

class ParticipanteSerializer(serializers.ModelSerializer):
    id_anonimo = serializers.SerializerMethodField()
    genero = serializers.CharField(source='usuario.genero')
    fecha_nacimiento = serializers.DateField(source='usuario.fechaNacimiento')
    ocupacion = serializers.CharField(source='usuario.ocupacion')
    nivel_educativo = serializers.CharField(source='usuario.nivelEducativo')
    ubicacion = serializers.CharField(source='usuario.ubicacion')
    experiencia_mindfulness = serializers.CharField(source='experienciaMindfulness')
    condiciones_salud = serializers.CharField(source='condicionesSalud')

    class Meta:
        model = Participante
        fields = [
            'id_anonimo',
            'genero',
            'fecha_nacimiento',
            'ocupacion',
            'nivel_educativo',
            'ubicacion',
            'experiencia_mindfulness',
            'condiciones_salud'
        ]

    def get_id_anonimo(self, obj):
        return f"P{obj.id}"

class InvestigadorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigador
        exclude = ('usuario',)

class ParticipanteProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        exclude = ('usuario',)

class UsuarioSerializer(serializers.ModelSerializer):
    perfil_investigador = InvestigadorProfileSerializer(read_only=True)
    perfil_participante = ParticipanteProfileSerializer(read_only=True)

    class Meta:
        model = Usuario
        fields = ('id', 'nombre', 'apellidos', 'username', 'password', 'email', 
                 'telefono', 'genero', 'fechaNacimiento', 'ubicacion', 
                 'ocupacion', 'nivelEducativo', 'perfil_investigador', 
                 'perfil_participante', 'date_joined', 'role')
        read_only_fields = ('id', 'date_joined')
        extra_kwargs = {
            'password': {'write_only': True}
        }

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=True)
    
    # Campos base comunes
    telefono = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    fechaNacimiento = serializers.DateField(required=False, allow_null=True)
    genero = serializers.ChoiceField(
        choices=Genero.choices,
        required=False,
        allow_blank=True
    )
    ubicacion = serializers.CharField(required=False, allow_blank=True)
    ocupacion = serializers.CharField(required=False, allow_blank=True)
    nivelEducativo = serializers.ChoiceField(
        choices=NivelEducativo.choices,
        required=False,
        allow_blank=True
    )
    
    # Campos específicos de investigador
    experienciaInvestigacion = serializers.ChoiceField(
        choices=ExperienciaInvestigacion.choices,
        required=False,
        allow_blank=True
    )
    areasInteres = serializers.JSONField(required=False)
    
    # Campos específicos de participante
    experienciaMindfulness = serializers.ChoiceField(
        choices=ExperienciaMindfulness.choices,
        required=False,
        allow_blank=True
    )
    condicionesSalud = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = ('nombre', 'apellidos', 'username', 'password', 'email', 
                 'telefono', 'genero', 'fechaNacimiento', 'ubicacion', 
                 'experienciaInvestigacion', 'experienciaMindfulness',
                 'ocupacion', 'nivelEducativo',  
                 'areasInteres', 'condicionesSalud', 'role')

    def validate(self, attrs):
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        

        return attrs

    def create(self, validated_data):
        try:
            perfil_data = {}
            
            if validated_data['role'] == 'INVESTIGADOR':
                perfil_fields = ['experienciaInvestigacion', 'areasInteres']
            else:
                perfil_fields = ['experienciaMindfulness', 'condicionesSalud']
            
            for field in perfil_fields:
                if field in validated_data:
                    perfil_data[field] = validated_data.pop(field)

            email = validated_data.pop('email')

            # Crear usuario
            usuario = Usuario.objects.create_user(
                email=email,
                **validated_data
            )

            # Crear perfil según el role
            if usuario.role == 'INVESTIGADOR':
                Investigador.objects.create(usuario=usuario, **perfil_data)
            else:
                Participante.objects.create(usuario=usuario, **perfil_data)

            return usuario
        except django.db.utils.IntegrityError as e:
            if 'usuario_usuario_username_key' in str(e):
                raise serializers.ValidationError('Ya existe un usuario con este nombre de usuario')
            elif 'usuario_usuario_email_key' in str(e):
                raise serializers.ValidationError('Ya existe un usuario con este correo electrónico')
            raise serializers.ValidationError('Error al crear el usuario')

class UpdateUsuarioSerializer(serializers.ModelSerializer):
    perfil_investigador = InvestigadorProfileSerializer(required=False)
    perfil_participante = ParticipanteProfileSerializer(required=False)

    class Meta:
        model = Usuario
        fields = ('nombre', 'apellidos', 'username', 'email', 'telefono', 'genero',
                 'fechaNacimiento', 'ubicacion', 'ocupacion', 
                 'nivelEducativo', 'perfil_investigador', 'perfil_participante')

    def update(self, instance, validated_data):
        perfil_investigador = validated_data.pop('perfil_investigador', None)
        perfil_participante = validated_data.pop('perfil_participante', None)

        # Actualizar usuario
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar perfil
        if perfil_investigador and instance.is_investigador():
            for attr, value in perfil_investigador.items():
                setattr(instance.perfil_investigador, attr, value)
            instance.perfil_investigador.save()
        elif perfil_participante and instance.is_participante():
            for attr, value in perfil_participante.items():
                setattr(instance.perfil_participante, attr, value)
            instance.perfil_participante.save()

        return instance

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        return value
