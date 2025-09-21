from django.shortcuts import render, redirect
from .models import Task, UserTask,  UserProfile
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets, permissions
from .serializers import UserTaskSerializer
from .forms import RegisterForm

# HTML view для главной страницы

@login_required
def task_list(request):
    # Задачи
    tasks = Task.objects.all()
    user_tasks = UserTask.objects.filter(user=request.user)
    user_task_dict = {ut.task.id: ut.is_done for ut in user_tasks}

    # Участники класса
    user_profile = request.user.userprofile
    class_group = user_profile.class_group
    participants = UserProfile.objects.filter(class_group=class_group)

    return render(request, "task_list.html", {
        "tasks": tasks,
        "user_task_dict": user_task_dict,
        "participants": participants,
    })

# API viewset для взаимодействия через DRF
class UserTaskViewSet(viewsets.ModelViewSet):
    serializer_class = UserTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserTask.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = RegisterForm()
    return render(request, "register.html", {"form": form})


@login_required
def home(request):
    user_profile = request.user.userprofile
    class_group = user_profile.class_group

    # Все участники этого класса
    participants = UserProfile.objects.filter(class_group=class_group)

    # Можно собрать статистику по задачам
    participants_stats = []
    for participant in participants:
        done_tasks = UserTask.objects.filter(user=participant.user, is_done=True).count()
        total_tasks = UserTask.objects.filter(user=participant.user).count()
        participants_stats.append({
            "username": participant.user.username,
            "done": done_tasks,
            "total": total_tasks,
        })

    return render(request, "home.html", {
        "participants_stats": participants_stats,
        "class_group": class_group,
    })