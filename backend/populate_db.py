import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from usuario.models import Usuario, Investigador, Participante
from programa.models import Programa, EstadoPublicacion, InscripcionPrograma
from sesion.models import Sesion
from cuestionario.models import Cuestionario, RespuestaCuestionario

from datetime import date, timedelta

def run():
    print("📦 Poblando base de datos...")

    # Borrar todos los datos de la base de datos
    Usuario.objects.all().delete()
    Investigador.objects.all().delete()
    Participante.objects.all().delete()
    Programa.objects.all().delete()
    Sesion.objects.all().delete()
    Cuestionario.objects.all().delete()
    RespuestaCuestionario.objects.all().delete()

    # Crear usuario admin
    user_admin, _ = Usuario.objects.get_or_create(
        email="admin@gmail.com",
        defaults={
            "username": "admin",
            "nombre": "Admin",
            "apellidos": "Demo",
            "role": "ADMIN",
            "is_superuser": True,
            "telefono": "123456789",
            "genero": "masculino",
            "fechaNacimiento": "1980-01-01",
            "ubicacion": "Madrid, España",
            "ocupacion": "Investigador en Mindfulness",
            "nivelEducativo": "doctorado",
        }
    )
    user_admin.set_password("12")
    user_admin.save()
    

    # Crear usuario investigador 1
    user_inv, _ = Usuario.objects.get_or_create(
        email="investigador@demo.com",
        defaults={
            "username": "investigador",
            "nombre": "Investigador",
            "apellidos": "Demo",
            "role": "INVESTIGADOR",
            "is_superuser": True,
            "telefono": "123456789",
            "genero": "masculino",
            "fechaNacimiento": "1980-01-01",
            "ubicacion": "Madrid, España",
            "ocupacion": "Investigador en Mindfulness",
            "nivelEducativo": "doctorado",
        }
    )
    user_inv.set_password("12")
    user_inv.save()
    inv, _ = Investigador.objects.get_or_create(
        usuario=user_inv,
        defaults={
            "experienciaInvestigacion": "si",
            "areasInteres": ["Mindfulness", "Psicología", "Educación"],
        }
    )

    # Crear usuario investigador 2 (Bea)
    user_inv2, _ = Usuario.objects.get_or_create(
        email="bea@gmail.com",
        defaults={
            "username": "bea",
            "nombre": "Beatriz",
            "apellidos": "Bernárdez",
            "role": "INVESTIGADOR",
            "is_superuser": True,
            "telefono": "987654321",
            "genero": "femenino",
            "fechaNacimiento": "1985-05-15",
            "ubicacion": "Sevilla, España",
            "ocupacion": "Profesora e Investigadora",
            "nivelEducativo": "doctorado",
        }
    )
    user_inv2.set_password("12")
    user_inv2.save()
    inv2, _ = Investigador.objects.get_or_create(
        usuario=user_inv2,
        defaults={
            "experienciaInvestigacion": "si",
            "areasInteres": ["Mindfulness", "Educación", "Bienestar"],
        }
    )

    # Crear usuario investigador 3 (Jon Kabat-Zinn)
    user_inv3, _ = Usuario.objects.get_or_create(
        email="jon.kabat.zinn@gmail.com",
        defaults={
            "username": "jon",
            "nombre": "Jon",
            "apellidos": "Kabat-Zinn",
            "role": "INVESTIGADOR",
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
    inv3, _ = Investigador.objects.get_or_create(
        usuario=user_inv3,
        defaults={
            "experienciaInvestigacion": "si",
            "areasInteres": ["Mindfulness", "Neurociencia", "Psicología", "Educación", "Meditación", "Bienestar"],
        }
    )
    inv3.save()

    # Crear usuarios participantes base (p1, p2, p3)
    participantes_base = [
        {
            "username": "p1",
            "email": "p1@demo.com",
            "nombre": "Participante",
            "apellidos": "Uno",
            "genero": "masculino",
            "fechaNacimiento": "1990-01-01",
            "ubicacion": "Madrid, España",
            "ocupacion": "Ingeniero",
            "nivelEducativo": "universidad",
            "experienciaMindfulness": "ninguna",
            "condicionesSalud": "Ninguna",
        },
        {
            "username": "p2",
            "email": "p2@demo.com",
            "nombre": "Participante",
            "apellidos": "Dos",
            "genero": "femenino",
            "fechaNacimiento": "1992-05-15",
            "ubicacion": "Barcelona, España",
            "ocupacion": "Médica",
            "nivelEducativo": "doctorado",
            "experienciaMindfulness": "menos_6_meses",
            "condicionesSalud": "Estrés laboral",
        },
        {
            "username": "p3",
            "email": "p3@demo.com",
            "nombre": "Participante",
            "apellidos": "Tres",
            "genero": "masculino",
            "fechaNacimiento": "1988-12-20",
            "ubicacion": "Valencia, España",
            "ocupacion": "Profesor",
            "nivelEducativo": "master",
            "experienciaMindfulness": "mas_10_anos",
            "condicionesSalud": "Ansiedad",
        }
    ]

    for p_data in participantes_base:
        user, _ = Usuario.objects.get_or_create(
            email=p_data["email"],
            defaults={
                "username": p_data["username"],
                "nombre": p_data["nombre"],
                "apellidos": p_data["apellidos"],
                "role": "PARTICIPANTE",
                "telefono": "123456789",
                "genero": p_data["genero"],
                "fechaNacimiento": p_data["fechaNacimiento"],
                "ubicacion": p_data["ubicacion"],
                "ocupacion": p_data["ocupacion"],
                "nivelEducativo": p_data["nivelEducativo"],
            }
        )
        user.set_password(p_data["username"])  # password igual al username
        user.save()
        participante, _ = Participante.objects.get_or_create(
            usuario=user,
            defaults={
                "experienciaMindfulness": p_data["experienciaMindfulness"],
                "condicionesSalud": p_data["condicionesSalud"],
            }
        )
        participante.save()

    # Crear mi usuario de prueba 1
    yo, _ = Usuario.objects.get_or_create(
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
    yo.set_password("12")
    yo.save()
    yopart, _ = Participante.objects.get_or_create(usuario=yo,
        defaults={
            "experienciaMindfulness": "mas_10_anos",
            "condicionesSalud": "Nada",
        }
    )
    yopart.save()

    # Crear mis usuarios de prueba (yo1, yo2, yo3)
    participantes_base = [
        {
            "username": "yo1",
            "email": "yo1@demo.com",
            "nombre": "Participante",
            "apellidos": "Uno",
            "genero": "masculino",
            "fechaNacimiento": "1990-01-01",
            "ubicacion": "Madrid, España",
            "ocupacion": "Ingeniero",
            "nivelEducativo": "universidad",
            "experienciaMindfulness": "ninguna",
            "condicionesSalud": "Ninguna",
        },
        {
            "username": "yo2",
            "email": "yo2@demo.com",
            "nombre": "Participante",
            "apellidos": "Dos",
            "genero": "femenino",
            "fechaNacimiento": "1992-05-15",
            "ubicacion": "Barcelona, España",
            "ocupacion": "Médica",
            "nivelEducativo": "doctorado",
            "experienciaMindfulness": "menos_6_meses",
            "condicionesSalud": "Estrés laboral",
        },
        {
            "username": "yo3",
            "email": "pyo33@demo.com",
            "nombre": "Participante",
            "apellidos": "Tres",
            "genero": "masculino",
            "fechaNacimiento": "1988-12-20",
            "ubicacion": "Valencia, España",
            "ocupacion": "Profesor",
            "nivelEducativo": "master",
            "experienciaMindfulness": "mas_10_anos",
            "condicionesSalud": "Ansiedad",
        }
    ]

    for p_data in participantes_base:
        user, _ = Usuario.objects.get_or_create(
            email=p_data["email"],
            defaults={
                "username": p_data["username"],
                "nombre": p_data["nombre"],
                "apellidos": p_data["apellidos"],
                "role": "PARTICIPANTE",
                "telefono": "123456789",
                "genero": p_data["genero"],
                "fechaNacimiento": p_data["fechaNacimiento"],
                "ubicacion": p_data["ubicacion"],
                "ocupacion": p_data["ocupacion"],
                "nivelEducativo": p_data["nivelEducativo"],
            }
        )
        user.set_password("12")  # password igual al username
        user.save()
        
        # Asegurarnos de que se crea el perfil de participante
        participante, _ = Participante.objects.get_or_create(
            usuario=user,
            defaults={
                "experienciaMindfulness": p_data["experienciaMindfulness"],
                "condicionesSalud": p_data["condicionesSalud"],
            }
        )
        participante.save()

    # Crear programas para Bea
    programa1 = Programa.objects.create(
        nombre="Mindfulness para la Vida Cotidiana",
        descripcion="Programa de 3 semanas para integrar mindfulness en el día a día",
        tipo_contexto="académico",
        enfoque_metodologico="MBSR",
        poblacion_objetivo="Adultos en general",
        duracion_semanas=3,
        creado_por=inv2
    )

    # Crear sesiones para programa1
    sesiones_programa1 = [
        {
            "titulo": "Introducción a la Atención Plena",
            "descripcion": "Fundamentos de mindfulness y su aplicación en la vida diaria",
            "semana": 1,
            "duracion_estimada": 25,
            "tipo_practica": "body_scan",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "La Respiración como Ancla",
            "descripcion": "Aprender a usar la respiración como punto de atención",
            "semana": 2,
            "duracion_estimada": 25,
            "tipo_practica": "breath",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "La Respiración como Ancla",
            "descripcion": "Aprender a usar la respiración como punto de atención",
            "semana": 3,
            "duracion_estimada": 10,
            "tipo_practica": "breath",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 10
        }
    ]

    for sesion_data in sesiones_programa1:
        Sesion.objects.create(
            programa=programa1,
            **sesion_data
        )

    # Crear programa para Jon Kabat-Zinn
    programa_jon = Programa.objects.create(
        nombre="MBSR Avanzado",
        descripcion="Programa avanzado de Reducción del Estrés Basado en Mindfulness (MBSR) para practicantes experimentados.",
        tipo_contexto="clínico",
        enfoque_metodologico="MBSR",
        poblacion_objetivo="Practicantes de mindfulness con experiencia previa",
        duracion_semanas=12,
        creado_por=inv3
    )

    # Crear sesiones para programa de Jon
    sesiones_programa_jon = [
        {
            "titulo": "Profundizando en la Práctica",
            "descripcion": "Exploración avanzada de las prácticas de mindfulness y su aplicación en situaciones complejas.",
            "semana": 1,
            "duracion_estimada": 60,
            "tipo_practica": "body_scan",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 30
        },
        {
            "titulo": "Mindfulness en la Relación",
            "descripcion": "Aplicación del mindfulness en las relaciones interpersonales y la comunicación consciente.",
            "semana": 2,
            "duracion_estimada": 60,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 30
        },
        {
            "titulo": "Mindfulness en la Educación",
            "descripcion": "Programa adaptado para docentes y estudiantes que busca mejorar el bienestar emocional en el ámbito educativo.",
            "semana": 3,
            "duracion_estimada": 40,
            "tipo_practica": "open_monitoring",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Atención y Concentración",
            "descripcion": "Prácticas para mejorar la atención y concentración en el estudio y la enseñanza.",
            "semana": 4,
            "duracion_estimada": 40,
            "tipo_practica": "open_monitoring",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Mindfulness y Creatividad",
            "descripcion": "Cómo la atención plena puede potenciar la creatividad en el proceso educativo.",
            "semana": 5,
            "duracion_estimada": 40,
            "tipo_practica": "open_monitoring",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Compasión en la Educación",
            "descripcion": "Desarrollar un enfoque compasivo hacia uno mismo y los estudiantes.",
            "semana": 6,
            "duracion_estimada": 40,
            "tipo_practica": "open_monitoring",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Integración en el Currículo",
            "descripcion": "Estrategias para incorporar mindfulness en el currículo educativo.",
            "semana": 7,
            "duracion_estimada": 40,
            "tipo_practica": "open_monitoring",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "La Relación con el Dolor",
            "descripcion": "Explorar cómo nos relacionamos con el dolor y el malestar físico.",
            "semana": 8,
            "duracion_estimada": 45,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 25
        },
        {
            "titulo": "Conciencia de la Respiración y el Cuerpo",
            "descripcion": "Utilizar la respiración como anclaje para trabajar con el dolor.",
            "semana": 9,
            "duracion_estimada": 45,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 25
        },
        {
            "titulo": "Movimiento Consciente y Límites",
            "descripcion": "Explorar el movimiento corporal consciente respetando los límites del cuerpo.",
            "semana": 10,
            "duracion_estimada": 45,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 25
        },
        {
            "titulo": "Pensamientos sobre la Salud",
            "descripcion": "Trabajar con pensamientos y creencias limitantes sobre la salud y la enfermedad.",
            "semana": 11,
            "duracion_estimada": 45,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 25
        },
        {
            "titulo": "Autocompasión y Enfermedad",
            "descripcion": "Cultivar la autocompasión en el contexto de la enfermedad crónica.",
            "semana": 12,
            "duracion_estimada": 45,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 25
        }
    ]

    # Crear las sesiones para el programa de Jon
    for sesion_data in sesiones_programa_jon:
        Sesion.objects.create(
            programa=programa_jon,
            **sesion_data
        )
    programa3 = Programa.objects.create(
        nombre="MBSR Clásico",
        descripcion="Programa original de Reducción del Estrés Basado en Mindfulness (MBSR) de 8 semanas.",
        tipo_contexto="clínico",
        enfoque_metodologico="MBSR",
        poblacion_objetivo="Personas con estrés crónico o ansiedad",
        duracion_semanas=8,
        creado_por=inv3
    )
    
    # Crear sesiones para programa3
    sesiones_programa3 = [
        {
            "titulo": "Piloto Automático",
            "descripcion": "Reconocer cómo vivimos en piloto automático y aprender a despertar a la conciencia del momento presente.",
            "semana": 1,
            "duracion_estimada": 45,
            "tipo_practica": "body_scan",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Enfrentando los Obstáculos",
            "descripcion": "Trabajar con las percepciones y los obstáculos que surgen durante la práctica de la atención plena.",
            "semana": 2,
            "duracion_estimada": 45,
            "tipo_practica": "body_scan",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Conciencia de la Respiración",
            "descripcion": "Profundizar en la práctica de la atención a la respiración como anclaje al momento presente.",
            "semana": 3,
            "duracion_estimada": 45,
            "tipo_practica": "breath",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Permaneciendo Presente",
            "descripcion": "Desarrollar la capacidad de permanecer presente frente al estrés y la incomodidad.",
            "semana": 4,
            "duracion_estimada": 45,
            "tipo_practica": "breath",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Permitir y Aceptar",
            "descripcion": "Cultivar una actitud de aceptación hacia la experiencia presente, sea agradable o desagradable.",
            "semana": 5,
            "duracion_estimada": 45,
            "tipo_practica": "open_monitoring",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Pensamientos No Son Hechos",
            "descripcion": "Explorar la relación con los pensamientos y aprender a verlos como eventos mentales, no como verdades absolutas.",
            "semana": 6,
            "duracion_estimada": 45,
            "tipo_practica": "open_monitoring",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Autocuidado",
            "descripcion": "Aprender a cuidar de uno mismo en tiempos de estrés y dificultad.",
            "semana": 7,
            "duracion_estimada": 45,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Integración en la Vida Diaria",
            "descripcion": "Consolidar lo aprendido e integrar la práctica de mindfulness en la vida cotidiana.",
            "semana": 8,
            "duracion_estimada": 45,
            "tipo_practica": "loving_kindness",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        }
    ]

    # Crear sesiones para programa3
    for sesion_data in sesiones_programa3:
        Sesion.objects.create(
            programa=programa3,
            **sesion_data
        )

    programa4 = Programa.objects.create(
        nombre="Mindfulness para la Salud",
        descripcion="Programa de 2 semanas para mejorar la salud física y mental",
        tipo_contexto="clínico",
        enfoque_metodologico="MBSR",
        poblacion_objetivo="Personas con problemas de salud crónicos",
        duracion_semanas=2,
        creado_por=inv3
    )
    
    # Crear sesiones para programa4
    sesiones_programa4 = [
        {
            "titulo": "Mindfulness y Bienestar",
            "descripcion": "Introducción a la práctica de mindfulness para la salud",
            "semana": 1,
            "duracion_estimada": 45,
            "tipo_practica": "body_scan",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        },
        {
            "titulo": "Cuidando el Cuerpo",
            "descripcion": "Prácticas de mindfulness para el cuidado del cuerpo",
            "semana": 2,
            "duracion_estimada": 45,
            "tipo_practica": "breath",
            "tipo_contenido": "temporizador",
            "contenido_temporizador": 20
        }
    ]

    for sesion_data in sesiones_programa4:
        Sesion.objects.create(
            programa=programa4,
            **sesion_data
        )

    # Publicar programa4 después de crear las sesiones
    # programa4.publicar()

    # Crear programa 5 borrador - Jon
    programa5 = Programa.objects.create(
        nombre="prueba",
        descripcion="Programa de 3 semanas para integrar mindfulness en el día a día",
        tipo_contexto="académico",
        enfoque_metodologico="MBSR",
        poblacion_objetivo="Adultos en general",
        duracion_semanas=3,
        creado_por=inv3
    )

    # Crear sesiones para programa5
    sesiones_programa5 = [
        {
            "titulo": "Introducción",
            "descripcion": "Fundamentos de mindfulness y su aplicación en la vida diaria",
            "semana": 1,
            "duracion_estimada": 10,
            "tipo_practica": "body_scan",
            "tipo_contenido": "enlace",
            "contenido_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        },
        {
            "titulo": "Desarrollo",
            "descripcion": "Aprender a usar la respiración como punto de atención",
            "semana": 2,
            "duracion_estimada": 30,
            "tipo_practica": "breath",
            "tipo_contenido": "enlace",
            "contenido_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "tipo_escala": "estres"
        },
        {
            "titulo": "Conclusión",
            "descripcion": "Aprender a usar la respiración como punto de atención",
            "semana": 3,
            "duracion_estimada": 5,
            "tipo_practica": "breath",
            "tipo_contenido": "enlace",
            "contenido_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "tipo_escala": "bienestar"
        }
    ]

    for sesion_data in sesiones_programa5:
        Sesion.objects.create(
            programa=programa5,
            **sesion_data
        )

    # Crear cuestionario para programa5
    # Crear preguntas para el cuestionario
    preguntas_programa5_pre = [
        {
            "id": 1,
            "texto": "¿Cuáles son tus expectativas para este programa de mindfulness?",
            "tipo": "texto"
        },
        {
            "id": 2,
            "texto": "¿Has practicado mindfulness anteriormente?",
            "tipo": "select",
            "opciones": ["Sí", "No", "Puede"]
        },
        {
            "id": 3,
            "texto": "Valora tu nivel actual de estrés",
            "tipo": "likert",
            "escala": {
                "inicio": 1,
                "fin": 5,
                "etiquetas": ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"]
            }
        },
        {
            "id": 4,
            "texto": "Ahora un multiple choice",
            "tipo": "checkbox",
            "opciones": ["a", "b", "c"]
        },
    ]
    
    preguntas_programa5_post = [
        {
            "id": 1,
            "texto": "Valora tu experiencia general con el programa",
            "tipo": "calificacion",
            "estrellas": {
                "cantidad": 5,
                "icono": "heart"
            }
        },
        {
            "id": 2,
            "texto": "Rellena esta escala likert",
            "tipo": "likert-5-puntos",
            "likert5Puntos": {
                "tipo": "acuerdo",
                "filas": ["f1", "f2"]
            }
        }
    ]
    
    # Cuestionario Pre para programa5
    cuestionario_pre_programa5 = Cuestionario.objects.create(
        programa=programa5,
        momento='pre',
        tipo_cuestionario='personalizado',
        titulo=f'Evaluación Inicial - {programa5.nombre}',
        descripcion='Cuestionario para evaluar el estado inicial antes de comenzar el programa',
        preguntas=preguntas_programa5_pre
    )
    
    # Cuestionario Post para programa5
    cuestionario_post_programa5 = Cuestionario.objects.create(
        programa=programa5,
        momento='post',
        tipo_cuestionario='personalizado',
        titulo=f'Evaluación Final - {programa5.nombre}',
        descripcion='Cuestionario para evaluar la experiencia con el programa',
        preguntas=preguntas_programa5_post
    )
    
    # Asignar los cuestionarios al programa5
    programa5.cuestionario_pre = cuestionario_pre_programa5
    programa5.cuestionario_post = cuestionario_post_programa5
    programa5.save()

    #===========================================================================
    # Crear cuestionarios con preguntas y respuestas
    preguntas_base = [
        {
            "id": 1,
            "texto": "¿Con qué frecuencia te sientes estresado/a?",
            "tipo": "select",
            "opciones": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]
        },
        {
            "id": 2,
            "texto": "¿Con qué frecuencia practicas mindfulness o meditación?",
            "tipo": "select",
            "opciones": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]
        },
        {
            "id": 3,
            "texto": "¿Cómo calificarías tu nivel de atención plena en el momento presente?",
            "tipo": "select",
            "opciones": ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"]
        },
        {
            "id": 4,
            "texto": "¿Con qué frecuencia te sientes abrumado/a por tus pensamientos?",
            "tipo": "select",
            "opciones": ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"]
        },
        {
            "id": 5,
            "texto": "¿Cómo calificarías tu capacidad para manejar situaciones estresantes?",
            "tipo": "select",
            "opciones": ["Muy baja", "Baja", "Media", "Alta", "Muy alta"]
        }
    ]

    # Crear cuestionarios pre y post para cada programa
    programas = [programa1, programa_jon, programa3, programa4]
    for programa in programas:
        # Cuestionario Pre
        cuestionario_pre = Cuestionario.objects.create(
            programa=programa,
            momento='pre',
            tipo_cuestionario='personalizado',
            titulo=f'Evaluación Inicial - {programa.nombre}',
            descripcion='Cuestionario para evaluar el estado inicial antes de comenzar el programa',
            preguntas=preguntas_base
        )

        # Cuestionario Post
        cuestionario_post = Cuestionario.objects.create(
            programa=programa,
            momento='post',
            tipo_cuestionario='personalizado',
            titulo=f'Evaluación Final - {programa.nombre}',
            descripcion='Cuestionario para evaluar el progreso después de completar el programa',
            preguntas=preguntas_base
        )

        # Asignar los cuestionarios al programa
        programa.cuestionario_pre = cuestionario_pre
        programa.cuestionario_post = cuestionario_post
        programa.save()

    # Publicar programas después de crear los cuestionarios
    programa1.publicar()
    programa_jon.publicar()
    programa3.publicar()

    # ================================================================
    # Enrolar participantes en programas
    participantes = Participante.objects.all()
    for participante in participantes[:2]:  # Enrolar los dos primeros participantes
        programa1.participantes.add(participante)
        InscripcionPrograma.objects.create(
            programa=programa1,
            participante=participante
        )

    # Enrolar el tercer participante en el programa de Jon
    programa_jon.participantes.add(participantes[2])
    InscripcionPrograma.objects.create(
        programa=programa_jon,
        participante=participantes[2]
    )





    print("✅ Base de datos poblada con datos de prueba.")


if __name__ == '__main__':
    run()
