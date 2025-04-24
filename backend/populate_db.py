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

    # Crear usuario investigador
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

    # Crear programas
    for i in range(1, 3):
        prog = Programa.objects.create(
            titulo=f"Programa Mindfulness {i}",
            descripcion="Este es un programa de ejemplo.",
            duracion=4,
            estado="ABIERTO",
            creado_por=inv
        )
        prog.participantes.set(participantes)
        prog.save()

        # Crear sesiones para cada programa
        for j in range(1, 3):
            Sesion.objects.create(
                programa=prog,
                titulo=f"Sesión {j} - Programa {i}",
                descripcion="Sesión de mindfulness práctica.",
                orden=j,
                fecha_disponible=date.today() + timedelta(days=j),
                duracion_minutos=20
            )

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
