# Generated by Django 5.1.7 on 2025-06-18 09:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('programa', '0002_initial'),
        ('sesion', '0001_initial'),
        ('usuario', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='diariosesion',
            name='participante',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='diarios', to='usuario.participante'),
        ),
        migrations.AddField(
            model_name='sesion',
            name='programa',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sesiones', to='programa.programa'),
        ),
        migrations.AddField(
            model_name='diariosesion',
            name='sesion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='diarios', to='sesion.sesion'),
        ),
        migrations.AlterUniqueTogether(
            name='sesion',
            unique_together={('programa', 'semana')},
        ),
        migrations.AlterUniqueTogether(
            name='diariosesion',
            unique_together={('participante', 'sesion')},
        ),
    ]
