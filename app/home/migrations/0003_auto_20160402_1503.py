# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_media_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='artist',
            name='profile_pic_thumb',
            field=models.URLField(default=b'/static/images/user-small.png', null=True),
        ),
        migrations.AlterField(
            model_name='artist',
            name='cover_pic',
            field=models.URLField(default=b'/static/images/banner1.png', null=True),
        ),
        migrations.AlterField(
            model_name='artist',
            name='profile_pic',
            field=models.URLField(default=b'/static/images/user.png', null=True),
        ),
        migrations.AlterField(
            model_name='media',
            name='type',
            field=models.CharField(max_length=2, null=True, choices=[(b'1', b'video'), (b'2', b'audio'), (b'3', b'image'), (b'4', b'article')]),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(default=b'Description'),
        ),
        migrations.AlterField(
            model_name='project',
            name='thumbnail',
            field=models.URLField(default=b'/static/images/edit/titleImage.png'),
        ),
        migrations.AlterField(
            model_name='project',
            name='title',
            field=models.CharField(default=b'Title', max_length=30),
        ),
        migrations.AlterField(
            model_name='project',
            name='type',
            field=models.CharField(default=b'Type', max_length=30),
        ),
    ]
