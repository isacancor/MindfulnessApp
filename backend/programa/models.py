from django.db import models
from usuario.models import Participante, Investigador
from django.utils import timezone
from datetime import timedelta
from config.enums import (
    TipoContexto, EnfoqueMetodologico,
    EstadoPublicacion, EstadoInscripcion
)

class Programa(models.Model):
    # Identificación y Metadatos Generales
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    tipo_contexto = models.CharField(
        max_length=50,
        choices=TipoContexto.choices,
        default=TipoContexto.CRECIMIENTO_PERSONAL
    )
    enfoque_metodologico = models.CharField(
        max_length=50,
        choices=EnfoqueMetodologico.choices,
        default=EnfoqueMetodologico.MBSR
    )
    poblacion_objetivo = models.CharField(max_length=255, blank=True, null=True)
    
    # Configuración de Duración
    duracion_semanas = models.PositiveIntegerField()

    # Configuración de Evaluación
    tiene_cuestionarios = models.BooleanField(default=True, help_text='Indica si el programa usa cuestionarios pre/post')
    tiene_diarios = models.BooleanField(default=True, help_text='Indica si el programa usa diarios de autoevaluación post-sesión')

    # Evaluaciones
    cuestionario_pre = models.ForeignKey(
        'cuestionario.Cuestionario', 
        on_delete=models.SET_NULL, 
        related_name='programas_pre', 
        null=True, 
        blank=True,
        db_column='cuestionario_pre'
    )
    cuestionario_post = models.ForeignKey(
        'cuestionario.Cuestionario', 
        on_delete=models.SET_NULL, 
        related_name='programas_post', 
        null=True, 
        blank=True,
        db_column='cuestionario_post'
    )
    
    # Estado de publicación
    estado_publicacion = models.CharField(
        max_length=20,
        choices=EstadoPublicacion.choices,
        default=EstadoPublicacion.BORRADOR
    )
    
    # Relaciones
    creado_por = models.ForeignKey(Investigador, on_delete=models.CASCADE, related_name='programas')
    participantes = models.ManyToManyField(Participante, related_name='programas_inscritos', blank=True)
    
    # Metadatos
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_publicacion = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.nombre

    def publicar(self):
        if self.estado_publicacion == EstadoPublicacion.BORRADOR:
            self.estado_publicacion = EstadoPublicacion.PUBLICADO
            self.fecha_publicacion = timezone.now()
            self.save()

    def puede_ser_publicado(self):
        return self.puede_ser_publicado1() and self.puede_ser_publicado2() and self.puede_ser_publicado3()

    # Comprobar si tiene todos los campos requeridos
    def puede_ser_publicado1(self):
        # Verificar campos requeridos
        campos_requeridos = [
            self.nombre,
            self.descripcion,
            self.tipo_contexto,
            self.enfoque_metodologico,
            self.poblacion_objetivo,
            self.duracion_semanas,
            self.creado_por
        ]
        
        if not all(campos_requeridos):
            return False
            
        return True

    # Comprobar si tiene todas las sesiones
    def puede_ser_publicado2(self):            
        # Verificar sesiones
        sesiones_requeridas = set(range(1, self.duracion_semanas + 1))
        sesiones_existentes = set(self.sesiones.values_list('semana', flat=True))
        
        if sesiones_requeridas != sesiones_existentes:
            return False
                
        return True

    # Comprobar si tiene los cuestionarios necesarios según el tipo de evaluación
    def puede_ser_publicado3(self):
        if self.estado_publicacion == EstadoPublicacion.PUBLICADO:
            if self.tiene_cuestionarios:
                tiene_pre = self.cuestionario_pre is not None
                tiene_post = self.cuestionario_post is not None
                if not (tiene_pre and tiene_post):
                    return False
                
        return True

    def puede_agregar_participantes(self):
        return self.estado_publicacion == EstadoPublicacion.PUBLICADO

    def puede_enviar_cuestionarios(self):
        return self.estado_publicacion == EstadoPublicacion.PUBLICADO

    def save(self, *args, **kwargs):
        if not self.pk:  # Si es un nuevo programa
            # Forzar que los programas nuevos siempre se creen como BORRADOR
            self.estado_publicacion = EstadoPublicacion.BORRADOR
            self.fecha_publicacion = None
            super().save(*args, **kwargs)
        else:  # Si el programa ya existe
            programa_original = Programa.objects.get(pk=self.pk)
            if programa_original.estado_publicacion == EstadoPublicacion.BORRADOR and self.estado_publicacion == EstadoPublicacion.PUBLICADO:
                # Si estamos intentando publicar, verificar que se puede publicar
                if not self.puede_ser_publicado1():
                    raise ValueError("No se puede publicar el programa. Asegúrese de que tiene todos los campos requeridos.")
                
                if not self.puede_ser_publicado2():
                    raise ValueError("No se puede publicar el programa. Asegúrese de que tiene todas las sesiones necesarias.")
                
                if not self.puede_ser_publicado3():
                    raise ValueError("No se puede publicar el programa. Asegúrese de que tiene los cuestionarios necesarios.")

                self.fecha_publicacion = timezone.now()
                super().save(*args, **kwargs)
            elif programa_original.estado_publicacion == EstadoPublicacion.BORRADOR and self.participantes.exists():
                # Si el programa está en borrador y tiene participantes, no permitir guardar
                raise ValueError("No se pueden agregar participantes a un programa en borrador")
            else:
                super().save(*args, **kwargs)

    def get_tipo_contexto_display(self):
        return dict(TipoContexto.choices).get(self.tipo_contexto, self.tipo_contexto)

    def get_enfoque_metodologico_display(self):
        return dict(EnfoqueMetodologico.choices).get(self.enfoque_metodologico, self.enfoque_metodologico)

    def get_estado_publicacion_display(self):
        return dict(EstadoPublicacion.choices).get(self.estado_publicacion, self.estado_publicacion)

    class Meta:
        ordering = ['-fecha_creacion']

class InscripcionPrograma(models.Model):
    programa = models.ForeignKey(Programa, on_delete=models.CASCADE, related_name='inscripciones')
    participante = models.ForeignKey(Participante, on_delete=models.CASCADE, related_name='inscripciones')
    fecha_inicio = models.DateTimeField(auto_now_add=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    estado_inscripcion = models.CharField(max_length=20, choices=EstadoInscripcion.choices, default=EstadoInscripcion.EN_PROGRESO)

    class Meta:
        unique_together = ('programa', 'participante')
        ordering = ['-fecha_inicio']

    def __str__(self):
        return f"{self.participante} - {self.programa}"

    def calcular_fecha_fin(self):
        if not self.fecha_fin:
            self.fecha_fin = self.fecha_inicio + timedelta(weeks=self.programa.duracion_semanas)
            self.save()
        return self.fecha_fin

    def completar_programa(self):
        if self.estado_inscripcion == EstadoInscripcion.EN_PROGRESO:
            fecha_fin = self.calcular_fecha_fin()
            if fecha_fin > timezone.now():
                self.estado_inscripcion = EstadoInscripcion.COMPLETADO

            # o si todas las sesiones están completadas
            usuario = self.participante
            sesiones_completadas = self.programa.sesiones.filter(completadas__participante=usuario).count()
            total_sesiones = self.programa.sesiones.count()
            
            # Si el programa no tiene cuestionarios, se marca como completado al terminar todas las sesiones
            if not self.programa.tiene_cuestionarios and sesiones_completadas == total_sesiones:
                self.estado_inscripcion = EstadoInscripcion.COMPLETADO
            # Si tiene cuestionarios, se marca como completado solo si se completaron todas las sesiones y se respondió el cuestionario post
            elif self.programa.tiene_cuestionarios and sesiones_completadas == total_sesiones:
                from cuestionario.models import RespuestaCuestionario
                cuestionario_post_respondido = RespuestaCuestionario.objects.filter(
                    participante=usuario,
                    cuestionario=self.programa.cuestionario_post
                ).exists()
                if cuestionario_post_respondido:
                    self.estado_inscripcion = EstadoInscripcion.COMPLETADO

            self.save()

    def get_estado_inscripcion_display(self):
        return dict(EstadoInscripcion.choices).get(self.estado_inscripcion, self.estado_inscripcion)
