# Generated by Django 5.1.7 on 2025-06-18 09:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InscripcionPrograma',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_inicio', models.DateTimeField(auto_now_add=True)),
                ('fecha_fin', models.DateTimeField(blank=True, null=True)),
                ('estado_inscripcion', models.CharField(choices=[('en_progreso', 'En progreso'), ('completado', 'Completado'), ('abandonado', 'Abandonado')], default='en_progreso', max_length=20)),
            ],
            options={
                'ordering': ['-fecha_inicio'],
            },
        ),
        migrations.CreateModel(
            name='Programa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('descripcion', models.TextField()),
                ('tipo_contexto', models.CharField(choices=[('académico', 'Académico'), ('laboral', 'Laboral'), ('clínico', 'Clínico/Terapéutico'), ('deportivo', 'Deportivo'), ('crecimiento_personal', 'Crecimiento Personal'), ('otro', 'Otro')], default='crecimiento_personal', max_length=50)),
                ('enfoque_metodologico', models.CharField(choices=[('MBSR', 'MBSR (Mindfulness-Based Stress Reduction)'), ('MBCT', 'MBCT (Mindfulness-Based Cognitive Therapy)'), ('MSC', 'MSC (Mindful Self-Compassion)'), ('MBRP', 'MBRP (Mindfulness-Based Relapse Prevention)'), ('MBPM', 'MBPM (Mindfulness-Based Pain Management)'), ('propio', 'Enfoque propio'), ('otro', 'Otro')], default='MBSR', max_length=50)),
                ('poblacion_objetivo', models.CharField(blank=True, max_length=255, null=True)),
                ('duracion_semanas', models.PositiveIntegerField()),
                ('tiene_cuestionarios', models.BooleanField(default=True, help_text='Indica si el programa usa cuestionarios pre/post')),
                ('tiene_diarios', models.BooleanField(default=True, help_text='Indica si el programa usa diarios de autoevaluación post-sesión')),
                ('estado_publicacion', models.CharField(choices=[('borrador', 'Borrador'), ('publicado', 'Publicado')], default='borrador', max_length=20)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
                ('fecha_publicacion', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'ordering': ['-fecha_creacion'],
            },
        ),
    ]
