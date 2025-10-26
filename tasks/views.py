from rest_framework import viewsets
from .models import Task, UserTask, UserStats, ClassGroup
from .serializers import TaskSerializer, UserTaskSerializer, UserStatsSerializer
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

def home(request):
    if request.user.is_authenticated:
        return redirect('home_logged')
    else:
        return render(request, "tasks/home_guest.html")

@login_required
def home_logged(request):
    user = request.user
    print(user)
    groups = user.class_groups.all()
    print(groups)
    first_group = groups.first()
    
    total_tasks = UserTask.objects.filter(user=user).count()
    completed_tasks = UserTask.objects.filter(user=user, is_done=True).count()
    streak = getattr(user.stats, "streak", 0) if hasattr(user, "stats") else 0

    group_tasks = {}
    for group in groups:
        tasks = Task.objects.filter(group=group).order_by("deadline")
        group_tasks[group] = tasks

    personal_group = groups.filter(is_personal=True).first()
    personal_tasks = Task.objects.filter(group=personal_group) if personal_group else []

    context = {
        'first_group': first_group,
        'user': user,
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'streak': streak,
        'group_tasks': group_tasks,
        'personal_tasks': personal_tasks,
    }
    return render(request, 'tasks/home_logged.html', context)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class UserTaskViewSet(viewsets.ModelViewSet):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer

class UserStatsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserStats.objects.all()
    serializer_class = UserStatsSerializer
