# Generated by Django 5.1.7 on 2025-06-18 09:42

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cuestionario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('momento', models.CharField(choices=[('pre', 'Pre'), ('post', 'Post')], default='pre', max_length=50)),
                ('tipo_cuestionario', models.CharField(choices=[('personalizado', 'Personalizado'), ('likert', 'Escala Likert'), ('predefinido', 'Predefinido')], default='personalizado', max_length=50)),
                ('titulo', models.CharField(max_length=200)),
                ('descripcion', models.TextField(default='Sin descripción')),
                ('preguntas', models.JSONField(default=list)),
                ('fecha_creacion', models.DateTimeField(default=django.utils.timezone.now)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Cuestionario',
                'verbose_name_plural': 'Cuestionarios',
                'db_table': 'cuestionario_cuestionario',
            },
        ),
        migrations.CreateModel(
            name='RespuestaCuestionario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('respuestas', models.JSONField(default=dict)),
                ('fecha_respuesta', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Respuesta de Cuestionario',
                'verbose_name_plural': 'Respuestas de Cuestionarios',
                'db_table': 'cuestionario_respuestacuestionario',
            },
        ),
    ]
