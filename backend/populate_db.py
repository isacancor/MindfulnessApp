import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from usuario.models import Usuario, Investigador, Participante
from programa.models import Programa
from sesion.models import Sesion
from cuestionario.models import Cuestionario, Pregunta, Respuesta

from datetime import date, timedelta

def run():
    print("📦 Poblando base de datos...")

    # Crear usuario investigador 1
    user_inv, _ = Usuario.objects.get_or_create(
        email="investigador@demo.com",
        defaults={
            "username": "investigador",
            "role": "INVESTIGADOR",
            "is_staff": True,
            "is_superuser": True,
        }
    )
    user_inv.set_password("1234")
    user_inv.save()
    inv, _ = Investigador.objects.get_or_create(usuario=user_inv)

    # Crear usuario investigador 2
    user_inv, _ = Usuario.objects.get_or_create(
        email="bea@gmail.com",
        defaults={
            "username": "bea",
            "role": "INVESTIGADOR",
            "is_staff": True,
            "is_superuser": True,
        }
    )
    user_inv.set_password("12")
    user_inv.save()
    inv2, _ = Investigador.objects.get_or_create(usuario=user_inv)

    # Crear usuario investigador 3
    user_inv, _ = Usuario.objects.get_or_create(
        email="jon.kabat.zinn@gmail.com",
        defaults={
            "username": "jon",
            "nombre": "Jon",
            "apellidos": "Kabat-Zinn",
            "role": "INVESTIGADOR",
            "is_staff": True,
            "is_superuser": True,
            "telefono": "123456789",
            "genero": "masculino",
            "fechaNacimiento": "1944-06-05",
            "ubicacion": "New York, Estados Unidos",
            "ocupacion": "Profesor, autor, investigador en medicina",
            "nivelEducativo": "doctorado",
        }
    )
    user_inv.set_password("12")
    user_inv.save()
    inv3, _ = Investigador.objects.get_or_create(usuario=user_inv,
        defaults={
            "experienciaInvestigacion": "Sí",
            "areasInteres": ["Mindfulness", "Neurociencia", "Psicología", "Educación", "Meditación", "Bienestar"],
        }
    )

    # Crear participantes
    for i in range(1, 3):
        email = f"participante{i}@demo.com"
        user, _ = Usuario.objects.get_or_create(
            email=email,
            defaults={
                "username": f"participante{i}",
                "role": "PARTICIPANTE"
            }
        )
        user.set_password("1234")
        user.save()
        Participante.objects.get_or_create(usuario=user)

    participantes = Participante.objects.all()

    # Crear usuario participante 2
    user_part, _ = Usuario.objects.get_or_create(
        email="alumno@gmail.com",
        defaults={
            "username": "alumno",
            "role": "PARTICIPANTE",
        }
    )
    user_part.set_password("12")
    user_part.save()
    part2, _ = Participante.objects.get_or_create(usuario=user_part)

     # Crear usuario participante 3
    user_part, _ = Usuario.objects.get_or_create(
        email="isabel@gmail.com",
        defaults={
            "username": "isabel",
            "nombre": "Isabel",
            "apellidos": "C C",
            "role": "PARTICIPANTE",
            "telefono": "123456789",
            "genero": "femenino",
            "fechaNacimiento": "2000-10-30",
            "ubicacion": "Sevilla, España",
            "ocupacion": "Estudiante de Ingeniería de Software",
            "nivelEducativo": "universidad",
        }
    )
    user_part.set_password("12")
    user_part.save()
    part3, _ = Participante.objects.get_or_create(usuario=user_part,
        defaults={
            "experienciaMindfulness": "mas_de_2_anos",
            "condicionesSalud": "Nada",
        }
    )

    #===================================================================
    


    # Crear programas para Bea
    programa1 = Programa.objects.create(
        nombre="Mindfulness para el Estrés Laboral",
        descripcion="Programa de 8 semanas diseñado para reducir el estrés en el entorno laboral mediante técnicas de mindfulness.",
        tipo_contexto="laboral",
        enfoque_metodologico="MBSR",
        escala="estres",
        poblacion_objetivo="Profesionales en activo",
        duracion_semanas=8,
        creado_por=inv2
    )

    sesion = Sesion.objects.create(
        titulo="Sesión 1: Introducción al Mindfulness",
        descripcion="Primera sesión del programa",
        orden=1,
        fecha_disponible=date.today(),
        duracion_minutos=6,
        programa=programa1
    )

    programa2 = Programa.objects.create(
        nombre="Mindfulness en la Educación",
        descripcion="Programa adaptado para docentes y estudiantes que busca mejorar el bienestar emocional en el ámbito educativo.",
        tipo_contexto="académico",
        enfoque_metodologico="MBCT",
        escala="estres",
        poblacion_objetivo="Docentes y estudiantes universitarios",
        duracion_semanas=6,
        creado_por=inv2
    )

    # Crear programas para Jon
    programa3 = Programa.objects.create(
        nombre="MBSR Clásico",
        descripcion="Programa original de Reducción del Estrés Basado en Mindfulness (MBSR) de 8 semanas.",
        tipo_contexto="clínico/terapéutico",
        enfoque_metodologico="MBSR",
        escala="estres",
        poblacion_objetivo="Personas con estrés crónico o ansiedad",
        duracion_semanas=8,
        creado_por=inv3
    )

    programa4 = Programa.objects.create(
        nombre="Mindfulness para la Salud",
        descripcion="Programa especializado en el uso de mindfulness para el manejo de condiciones de salud crónicas.",
        tipo_contexto="clínico/terapéutico",
        enfoque_metodologico="MBSR",
        escala="estres",
        poblacion_objetivo="Personas con condiciones de salud crónicas",
        duracion_semanas=10,
        creado_por=inv3
    )

    # Asignar participantes a algunos programas
    #programa1.participantes.add(part2)
    #programa3.participantes.add(part3)

    # Crear cuestionario con preguntas y respuestas
    sesion = Sesion.objects.first()
    cuestionario = Cuestionario.objects.create(
        titulo="Cuestionario de evaluación inicial",
        sesion=sesion
    )

    for n in range(1, 3):
        pregunta = Pregunta.objects.create(
            cuestionario=cuestionario,
            texto=f"¿Cómo te sientes hoy? ({n})"
        )
        for r in ["Bien", "Mal"]:
            Respuesta.objects.create(
                pregunta=pregunta,
                texto=r
            )

    print("✅ Base de datos poblada con datos de prueba.")


if __name__ == '__main__':
    run()
