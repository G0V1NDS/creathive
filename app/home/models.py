from django.conf import settings
from django.contrib import admin
from django.db import models

# Create your models here.
from django.utils import timezone


class Artist(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    about_me = models.TextField(null=True)
    profile_pic = models.URLField(null=True, default='/static/images/user.png')
    profile_pic_thumb = models.URLField(null=True, default='/static/images/user-small.png')
    cover_pic = models.URLField(null=True, default='/static/images/banner1.png')

    def __unicode__(self):
        return unicode(self.user) or u''

    class Meta:
        db_table = "artists"


class Project(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    title = models.CharField(max_length=30,default='Title')
    description = models.TextField(default='Description')
    thumbnail = models.URLField(default='/static/images/edit/titleImage.png')
    type = models.CharField(max_length=30,default='Type')
    created = models.DateTimeField(default=timezone.now, blank=True)

    def __unicode__(self):
        return self.title

    class Meta:
        db_table = "projects"

admin.site.register(Project)


class Media(models.Model):
    project = models.ForeignKey(Project,on_delete=models.CASCADE)
    title = models.TextField()
    description = models.TextField(null=True, blank=True)
    thumbnail = models.URLField(default='/static/images/thumb.png')
    VIDEO = '1'
    AUDIO = '2'
    IMAGE = '3'
    ARTICLE ='4'
    MEDIA_TYPE = (
        (VIDEO, 'video'),
        (AUDIO, 'audio'),
        (IMAGE, 'image'),
        (ARTICLE, 'article')
    )
    type = models.CharField(max_length=2, choices=MEDIA_TYPE, null=True)
    media_url = models.URLField(null=True)
    created = models.DateTimeField(default=timezone.now, blank=True)

    def get_default_title(self):
        return "Sample Media Title{0}".format(self.id)

    def get_default_description(self):
        return "Sample Media Description{0}".format(self.id)


    def __unicode__(self):
        return self.title

    class Meta:
        db_table = "project_media"

admin.site.register(Media)
