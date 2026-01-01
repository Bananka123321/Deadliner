from rest_framework import serializers
from .models import Task, UserTask, UserStats, ClassGroup, GroupRole
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        
    def validate_group(self, value):
        user = self.context["request"].user
        
        if not GroupRole.objects.filter(user=user, group=value, role="admin").exists():
            raise serializers.ValidationError("Only admin can create tasks")
        return value

class UserTaskSerializer(serializers.ModelSerializer):
    task_details = TaskSerializer(source="task", read_only=True)
    
    class Meta:
        model = UserTask
        fields = "__all__"

class UserStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStats
        fields = "__all__"


class ClassGroupSerialzer(serializers.ModelSerializer):
    members_count = serializers.IntegerField(source="members.count", read_only=True)
    
    class Meta:
        model = ClassGroup
        fields = ["id", "name", "members", "members_count", "created_at"]
        
        extra_kwargs = {"members": {"required": False}}
        
    def create(self, validated_data):
        user = self.context["request"].user
        
        members_data = validated_data.pop("members", [])
        group = ClassGroup.objects.create(**validated_data)
        
        group.members.add(user)
        for member in members_data:
            group.members.add(member)
            
        GroupRole.objects.create(user=user, group=group, role="admin")
        
        return group