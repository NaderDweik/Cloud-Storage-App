# Generated by Django 5.1.2 on 2024-11-01 13:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('driveapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='folder',
            name='parent_folder',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subfolders', to='driveapp.folder'),
        ),
    ]