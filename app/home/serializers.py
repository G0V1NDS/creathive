import logging
from rest_framework import serializers
from app.home.models import Project, Media


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'type', 'description', 'thumbnail', 'created')


class MediaSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    class Meta:
        model = Media
        fields = ('id', 'title', 'type', 'description', 'media_url', 'thumbnail', 'created')


    def get_type(self,obj):
        return obj.get_type_display()

