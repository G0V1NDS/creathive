import logging
from rest_framework import serializers
from app.home.models import Project



class ProjectSerializer(serializers.ModelSerializer):
    """
        Account Profile serializer to handle Profile updation.
    """

    class Meta:
        model = Project
        fields = ('id', 'title', 'type', 'description', 'thumbnail', 'created')

