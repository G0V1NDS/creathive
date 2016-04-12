# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='media',
            name='type',
            field=models.CharField(max_length=2, null=True, choices=[(b'1', b'Video'), (b'2', b'Audio'), (b'3', b'Image'), (b'4', b'Article')]),
        ),
    ]
