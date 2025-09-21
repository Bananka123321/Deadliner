from django.shortcuts import render, redirect
from .models import Task, UserTask
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets, permissions
from .serializers import UserTaskSerializer
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login

# HTML view для главной страницы
@login_required()  # или '/accounts/login/'
def task_list(request):
    username = request.user.username
    tasks = Task.objects.all()
    user_tasks = UserTask.objects.filter(user=request.user)
    user_task_dict = {ut.task.id: ut.is_done for ut in user_tasks}
    return render(request, "task_list.html", {"tasks": tasks, "user_task_dict": user_task_dict, "username": username})

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
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()       # создаём пользователя
            login(request, user)     # сразу логиним его
            return redirect("home")  # отправляем на главную
    else:
        form = UserCreationForm()
    return render(request, "register.html", {"form": form})