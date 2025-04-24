from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Usuario, Investigador, Participante, NivelEducativo, ExperienciaMindfulness

class InvestigadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigador
        fields = '__all__'

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = '__all__'

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
        fields = ('id', 'email', 'username', 'nombre', 'apellidos', 'role', 
                 'fechaNacimiento', 'genero', 'perfil_investigador', 
                 'perfil_participante', 'date_joined')
        read_only_fields = ('id', 'date_joined')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    username = serializers.CharField(required=True)
    
    # Campos de perfil investigador
    telefono = serializers.CharField(required=False, allow_blank=True)
    ocupacion = serializers.CharField(required=False, allow_blank=True)
    nivelEducativo = serializers.ChoiceField(
        choices=NivelEducativo.choices,
        required=False,
        allow_blank=True
    )
    areasInteres = serializers.JSONField(required=False)
    experienciaInvestigacion = serializers.ChoiceField(
        choices=[
            ('Sí', 'Sí'),
            ('No', 'No'),
            ('En parte', 'En parte'),
        ],
        required=False,
        allow_blank=True
    )
    ubicacion = serializers.CharField(required=False, allow_blank=True)
    
    # Campos de perfil participante
    experienciaMindfulness = serializers.ChoiceField(
        choices=ExperienciaMindfulness.choices,
        required=False,
        allow_blank=True
    )
    condicionesSalud = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Usuario
        fields = ('email', 'username', 'password', 'nombre', 'apellidos',
                 'role', 'fechaNacimiento', 'genero', 'telefono', 'ocupacion',
                 'nivelEducativo', 'areasInteres', 'experienciaInvestigacion',
                 'ubicacion', 'experienciaMindfulness', 'condicionesSalud')

    def validate(self, attrs):
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        perfil_data = {}
        
        if validated_data['role'] == 'INVESTIGADOR':
            perfil_fields = ['telefono', 'ocupacion', 'nivelEducativo', 
                           'areasInteres', 'experienciaInvestigacion', 'ubicacion']
        else:
            perfil_fields = ['ocupacion', 'nivelEducativo', 'experienciaMindfulness', 
                           'condicionesSalud']
        
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

class UpdateUsuarioSerializer(serializers.ModelSerializer):
    perfil_investigador = InvestigadorProfileSerializer(required=False)
    perfil_participante = ParticipanteProfileSerializer(required=False)

    class Meta:
        model = Usuario
        fields = ('nombre', 'apellidos', 'fechaNacimiento', 'genero',
                 'perfil_investigador', 'perfil_participante')

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
