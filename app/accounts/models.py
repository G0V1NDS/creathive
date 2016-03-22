from django.contrib import admin


# class Account(models.Model):
#     fname = models.CharField(max_length=30)
#     lname = models.CharField(max_length=30)
#     username = models.CharField(max_length=30, unique=True)
#     password = models.CharField(max_length=30)
#     email = models.EmailField(unique=True, max_length=255)
# admin.site.register(Account)

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, Group, Permission
from datetime import datetime


class AccountManager(BaseUserManager):

    def _create_user(self, email, first_name, last_name, password, is_staff, is_superuser, **extra_fields):
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model( email=email, first_name=first_name, last_name=last_name, is_staff=is_staff,
                          is_active=False, is_superuser=is_superuser, last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def _create_super_user(self, email, password, is_staff, is_superuser, **extra_fields):
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model( email=email, is_staff=is_staff,
                          is_active=False, is_superuser=is_superuser, last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.is_active = True
        user.save(using=self._db)
        return user

    def create_user(self, email=None, first_name=None, last_name=None, password=None, **extra_fields):
        # if 'username' in extra_fields:
        #     extra_fields.pop('username')
        return self._create_user(email, first_name, last_name, password, False, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        user = self._create_super_user( email, password, True, True, **extra_fields)
        user.is_active = True
        user.save(using=self._db)
        return user

    def update_user_details(self, email,  first_name, last_name):
        """
        Update the user details by email.
        :param email:
        :param first_name:
        :param last_name:
        :return:
        """
        user = Account.objects.get(email=email)
        if user is not None:
            user.first_name = first_name
            user.last_name = last_name
            user.save
            return user
        return None


class Account(AbstractBaseUser):
    groups = models.ManyToManyField(Group, verbose_name=_('groups'), blank=True,
        related_name="tmp_user_set", related_query_name="user")
    user_permissions = models.ManyToManyField(Permission,
        verbose_name=_('user permissions'), blank=True,
        related_name="tmp_user_set", related_query_name="user")
    first_name = models.CharField(_('first name'), max_length=30, blank=True, null=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True, null=True)
    email = models.EmailField(_('email address'), unique=True, max_length=255)
    date_of_birth = models.DateField(null=True)
    contact_number = models.CharField(max_length=30, blank=True, null=True)
    location = models.CharField(max_length=30, null=True)
    username = models.CharField(max_length=30,blank=False, null= False,unique=True)

    MALE = '1'
    FEMALE = '2'
    OTHER = '3'
    GENDER_CHOICES = (
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (OTHER, 'Other'),
    )

    gender = models.CharField(max_length=2, choices=GENDER_CHOICES,null=True)

    is_staff = models.BooleanField(_('staff status'), default=True)
    is_active = models.BooleanField(_('active'), default=True)
    is_superuser = models.BooleanField(_('active'), default=True)
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)
    receive_newsletter = models.BooleanField(_('receive newsletter'), default=False)
    facebook_id = models.CharField(max_length=30, blank=True)
    activation_key = models.CharField(max_length=40, blank="True")
    reset_password_key = models.CharField(max_length=40, blank="True")
    key_expires = models.DateTimeField(default=datetime.now())
    is_email_verified = models.BooleanField(default=True)
    objects = AccountManager()

    USERNAME_FIELD = 'username'

    class Meta:
        db_table = "accounts"

    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser