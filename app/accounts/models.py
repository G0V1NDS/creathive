from django.db import models
# Create your models here.
from django.contrib import admin


class Account(models.Model):
    fname = models.CharField(max_length=30)
    lname = models.CharField(max_length=30)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=30)
    email = models.EmailField(unique=True, max_length=255)


admin.site.register(Account)
