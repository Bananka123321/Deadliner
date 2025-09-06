from rest_framework import serializers
from .models import Task, UserTask

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"

class UserTaskSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = UserTask
        fields = ("id", "task", "is_done")
