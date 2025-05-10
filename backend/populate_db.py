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
    user_inv2, _ = Usuario.objects.get_or_create(
        email="bea@gmail.com",
        defaults={
            "username": "bea",
            "role": "INVESTIGADOR",
            "is_staff": True,
            "is_superuser": True,
        }
    )
    user_inv2.set_password("12")
    user_inv2.save()
    inv2, _ = Investigador.objects.get_or_create(usuario=user_inv2)

    # Crear usuario investigador 3
    user_inv3, _ = Usuario.objects.get_or_create(
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
    user_inv3.set_password("12")
    user_inv3.save()
    inv3, _ = Investigador.objects.get_or_create(usuario=user_inv3,
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
        creado_por=user_inv2
    )

    # Crear sesiones para programa1 (solo con campos mínimos)
    sesiones_programa1 = [
        {
            "titulo": "Introducción al Mindfulness",
            "descripcion": "Primera sesión para entender los conceptos básicos del mindfulness y su aplicación al estrés laboral.",
            "semana": 1
        },
        {
            "titulo": "Exploración Corporal",
            "descripcion": "Aprende a reconocer las sensaciones corporales relacionadas con el estrés.",
            "semana": 2
        },
        {
            "titulo": "Respiración Consciente",
            "descripcion": "Técnicas de respiración para gestionar situaciones estresantes en el trabajo.",
            "semana": 3
        },
        {
            "titulo": "Pensamientos y Emociones",
            "descripcion": "Identificar patrones de pensamiento negativos en el entorno laboral.",
            "semana": 4
        },
        {
            "titulo": "Comunicación Consciente",
            "descripcion": "Mejorar la comunicación en el entorno laboral mediante la atención plena.",
            "semana": 5
        },
        {
            "titulo": "Gestión del Tiempo",
            "descripcion": "Aplicar mindfulness para mejorar la productividad y gestión del tiempo.",
            "semana": 6
        },
        {
            "titulo": "Autocompasión en el Trabajo",
            "descripcion": "Desarrollar la autocompasión para manejar la autocrítica y el perfeccionismo laboral.",
            "semana": 7
        },
        {
            "titulo": "Integración y Plan de Continuidad",
            "descripcion": "Integrar las prácticas de mindfulness en la rutina laboral diaria.",
            "semana": 8
        }
    ]

    # Crear sesiones con los campos mínimos
    for i, sesion_data in enumerate(sesiones_programa1, 1):
        try:
            sesion = Sesion.objects.create(
                programa=programa1,
                titulo=sesion_data["titulo"],
                descripcion=sesion_data["descripcion"],
                semana=sesion_data["semana"],
                duracion_estimada=45,
                tipo_practica='focus_attention',
                tipo_contenido='temporizador',
                contenido_temporizador=15
            )
            # print(f"Sesión {i} creada: {sesion.titulo}")
        except Exception as e:
            print(f"Error al crear sesión {i}: {e}")

    programa2 = Programa.objects.create(
        nombre="Mindfulness en la Educación",
        descripcion="Programa adaptado para docentes y estudiantes que busca mejorar el bienestar emocional en el ámbito educativo.",
        tipo_contexto="académico",
        enfoque_metodologico="MBCT",
        escala="estres",
        poblacion_objetivo="Docentes y estudiantes universitarios",
        duracion_semanas=6,
        creado_por=user_inv2
    )
    
    # Crear sesiones para programa2 (solo con campos mínimos)
    sesiones_programa2 = [
        {
            "titulo": "Mindfulness en el Aula",
            "descripcion": "Introducción a la aplicación del mindfulness en contextos educativos.",
            "semana": 1
        },
        {
            "titulo": "Gestión de Emociones en la Enseñanza",
            "descripcion": "Técnicas para manejar emociones difíciles en el entorno educativo.",
            "semana": 2
        },
        {
            "titulo": "Atención y Concentración",
            "descripcion": "Prácticas para mejorar la atención y concentración en el estudio y la enseñanza.",
            "semana": 3
        },
        {
            "titulo": "Mindfulness y Creatividad",
            "descripcion": "Cómo la atención plena puede potenciar la creatividad en el proceso educativo.",
            "semana": 4
        },
        {
            "titulo": "Compasión en la Educación",
            "descripcion": "Desarrollar un enfoque compasivo hacia uno mismo y los estudiantes.",
            "semana": 5
        },
        {
            "titulo": "Integración en el Currículo",
            "descripcion": "Estrategias para incorporar mindfulness en el currículo educativo.",
            "semana": 6
        }
    ]

    # Crear sesiones con los campos mínimos
    for i, sesion_data in enumerate(sesiones_programa2, 1):
        try:
            sesion = Sesion.objects.create(
                programa=programa2,
                titulo=sesion_data["titulo"],
                descripcion=sesion_data["descripcion"],
                semana=sesion_data["semana"],
                duracion_estimada=40,
                tipo_practica='open_monitoring',
                tipo_contenido='temporizador',
                contenido_temporizador=20
            )
            # print(f"Sesión {i} creada para programa2: {sesion.titulo}")
        except Exception as e:
            print(f"Error al crear sesión {i} para programa2: {e}")

    programa3 = Programa.objects.create(
        nombre="MBSR Clásico",
        descripcion="Programa original de Reducción del Estrés Basado en Mindfulness (MBSR) de 8 semanas.",
        tipo_contexto="clínico/terapéutico",
        enfoque_metodologico="MBSR",
        escala="estres",
        poblacion_objetivo="Personas con estrés crónico o ansiedad",
        duracion_semanas=8,
        creado_por=user_inv3
    )
    
    # Crear sesiones para programa3 (solo con campos mínimos)
    sesiones_programa3 = [
        {
            "titulo": "Piloto Automático",
            "descripcion": "Reconocer cómo vivimos en piloto automático y aprender a despertar a la conciencia del momento presente.",
            "semana": 1
        },
        {
            "titulo": "Enfrentando los Obstáculos",
            "descripcion": "Trabajar con las percepciones y los obstáculos que surgen durante la práctica de la atención plena.",
            "semana": 2
        },
        {
            "titulo": "Conciencia de la Respiración",
            "descripcion": "Profundizar en la práctica de la atención a la respiración como anclaje al momento presente.",
            "semana": 3
        },
        {
            "titulo": "Permaneciendo Presente",
            "descripcion": "Desarrollar la capacidad de permanecer presente frente al estrés y la incomodidad.",
            "semana": 4
        },
        {
            "titulo": "Permitir y Aceptar",
            "descripcion": "Cultivar una actitud de aceptación hacia la experiencia presente, sea agradable o desagradable.",
            "semana": 5
        },
        {
            "titulo": "Pensamientos No Son Hechos",
            "descripcion": "Explorar la relación con los pensamientos y aprender a verlos como eventos mentales, no como verdades absolutas.",
            "semana": 6
        },
        {
            "titulo": "Autocuidado",
            "descripcion": "Aprender a cuidar de uno mismo en tiempos de estrés y dificultad.",
            "semana": 7
        },
        {
            "titulo": "Integración en la Vida Diaria",
            "descripcion": "Consolidar lo aprendido e integrar la práctica de mindfulness en la vida cotidiana.",
            "semana": 8
        }
    ]

    # Crear sesiones con los campos mínimos
    for i, sesion_data in enumerate(sesiones_programa3, 1):
        try:
            sesion = Sesion.objects.create(
                programa=programa3,
                titulo=sesion_data["titulo"],
                descripcion=sesion_data["descripcion"],
                semana=sesion_data["semana"],
                duracion_estimada=50,
                tipo_practica='body_scan',
                tipo_contenido='temporizador',
                contenido_temporizador=30
            )
            # print(f"Sesión {i} creada para programa3: {sesion.titulo}")
        except Exception as e:
            print(f"Error al crear sesión {i} para programa3: {e}")

    programa4 = Programa.objects.create(
        nombre="Mindfulness para la Salud",
        descripcion="Programa especializado en el uso de mindfulness para el manejo de condiciones de salud crónicas.",
        tipo_contexto="clínico/terapéutico",
        enfoque_metodologico="MBSR",
        escala="estres",
        poblacion_objetivo="Personas con condiciones de salud crónicas",
        duracion_semanas=10,
        creado_por=user_inv3
    )
    
    # Crear sesiones para programa4 (solo con campos mínimos)
    sesiones_programa4 = [
        {
            "titulo": "La Relación con el Dolor",
            "descripcion": "Explorar cómo nos relacionamos con el dolor y el malestar físico.",
            "semana": 1
        },
        {
            "titulo": "Conciencia de la Respiración y el Cuerpo",
            "descripcion": "Utilizar la respiración como anclaje para trabajar con el dolor.",
            "semana": 2
        },
        {
            "titulo": "Movimiento Consciente y Límites",
            "descripcion": "Explorar el movimiento corporal consciente respetando los límites del cuerpo.",
            "semana": 3
        },
        {
            "titulo": "Pensamientos sobre la Salud",
            "descripcion": "Trabajar con pensamientos y creencias limitantes sobre la salud y la enfermedad.",
            "semana": 4
        },
        {
            "titulo": "Autocompasión y Enfermedad",
            "descripcion": "Cultivar la autocompasión en el contexto de la enfermedad crónica.",
            "semana": 5
        },
        {
            "titulo": "Comunicación Consciente con Profesionales Sanitarios",
            "descripcion": "Mejorar la comunicación con los profesionales de la salud desde la atención plena.",
            "semana": 6
        },
        {
            "titulo": "Vivir con Incertidumbre",
            "descripcion": "Desarrollar recursos para manejar la incertidumbre asociada a condiciones de salud.",
            "semana": 7
        },
        {
            "titulo": "Equilibrio en la Vida",
            "descripcion": "Encontrar equilibrio entre actividad y descanso, esfuerzo y rendición.",
            "semana": 8
        },
        {
            "titulo": "Alegría y Gratitud",
            "descripcion": "Cultivar estados mentales positivos incluso en presencia de dificultades de salud.",
            "semana": 9
        },
        {
            "titulo": "Continuando el Camino",
            "descripcion": "Desarrollar un plan personalizado para continuar con la práctica a largo plazo.",
            "semana": 10
        }
    ]

    # Crear sesiones con los campos mínimos
    for i, sesion_data in enumerate(sesiones_programa4, 1):
        try:
            sesion = Sesion.objects.create(
                programa=programa4,
                titulo=sesion_data["titulo"],
                descripcion=sesion_data["descripcion"],
                semana=sesion_data["semana"],
                duracion_estimada=45,
                tipo_practica='loving_kindness',
                tipo_contenido='temporizador',
                contenido_temporizador=25
            )
            # print(f"Sesión {i} creada para programa4: {sesion.titulo}")
        except Exception as e:
            print(f"Error al crear sesión {i} para programa4: {e}")

    # Asignar participantes a algunos programas
    try:
        programa1.participantes.add(part2)
        programa3.participantes.add(part3)
        # print("Participantes asignados a programas correctamente")
    except Exception as e:
        print(f"Error al asignar participantes a programas: {e}")

    # Crear cuestionario con preguntas y respuestas
    try:
        # Intentar obtener la primera sesión disponible
        primera_sesion = Sesion.objects.first()
        if primera_sesion:
            cuestionario = Cuestionario.objects.create(
                titulo="Cuestionario de evaluación inicial",
                sesion=primera_sesion
            )
            # print(f"Cuestionario creado para la sesión: {primera_sesion.titulo}")

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
            # print("Preguntas y respuestas creadas correctamente")
        else:
            print("No se encontraron sesiones para crear el cuestionario")
    except Exception as e:
        print(f"Error al crear cuestionario, preguntas o respuestas: {e}")

    print("✅ Base de datos poblada con datos de prueba.")


if __name__ == '__main__':
    run()
