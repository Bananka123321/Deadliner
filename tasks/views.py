from django.shortcuts import render
from .models import Task
from rest_framework import viewsets
from .serializers import TaskSerializer

def home(request):
    return render(request, "home.html")

def task_list(request):
    tasks = Task.objects.all()
    return render(request, "task_list.html", {"tasks": tasks})

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer