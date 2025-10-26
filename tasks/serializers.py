from rest_framework import serializers
from .models import Task, UserTask, UserStats

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"

class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTask
        fields = "__all__"

class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = "__all__"
