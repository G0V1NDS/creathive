# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('about_me', models.TextField(null=True)),
                ('profile_pic', models.URLField(default=b'/static/images/banner1.png', null=True)),
                ('cover_pic', models.URLField(default=b'/static/images/user.png', null=True)),
                ('user', models.OneToOneField(to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'artists',
            },
        ),
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.TextField()),
                ('description', models.TextField(null=True, blank=True)),
                ('thumbnail', models.URLField(default=b'/static/images/thumb.png')),
                ('media_url', models.URLField(null=True)),
                ('created', models.DateTimeField(default=django.utils.timezone.now, blank=True)),
            ],
            options={
                'db_table': 'project_media',
            },
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=30)),
                ('description', models.TextField()),
                ('thumbnail', models.URLField(default=b'/static/images/projects.png')),
                ('type', models.CharField(max_length=30)),
                ('created', models.DateTimeField(default=django.utils.timezone.now, blank=True)),
                ('artist', models.ForeignKey(to='home.Artist')),
            ],
            options={
                'db_table': 'projects',
            },
        ),
        migrations.AddField(
            model_name='media',
            name='project',
            field=models.ForeignKey(to='home.Project'),
        ),
    ]
