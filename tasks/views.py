from rest_framework import viewsets
from .models import Task, UserTask, UserStats, ClassGroup
from .serializers import TaskSerializer, UserTaskSerializer, UserStatsSerializer
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils import timezone

def home(request):
    if request.user.is_authenticated:
        return redirect('home_logged')
    else:
        return render(request, "tasks/home_guest.html")

@login_required
def home_logged(request):
    user = request.user
    groups = user.class_groups.all()

    # Статистика
    total_done = UserTask.objects.filter(
        user=user,
        status__in=[UserTask.Status.DONE_ON_TIME, UserTask.Status.DONE_LATE]
    ).count()
    expired = UserTask.objects.filter(user=user, status=UserTask.Status.EXPIRED).count()
    current_streak = getattr(user.stats, "streak", 0) if hasattr(user, "stats") else 0

    # Задачи по группам
    group_tasks = {}
    for group in groups:
        tasks = Task.objects.filter(group=group).order_by("deadline")
        group_tasks[group] = tasks

    # Личные задачи
    personal_group = groups.filter(is_personal=True).first()
    personal_tasks = Task.objects.filter(group=personal_group) if personal_group else []

    context = {
        'user': user,
        'group_tasks': group_tasks,
        'personal_tasks': personal_tasks,
        'total_done': total_done,
        'expired': expired,
        'current_streak': current_streak,
    }

    return render(request, 'tasks/home_logged.html', context)



def group_tasks(request, group_id):
    tasks = Task.objects.filter(group_id=group_id)

    grouped = {}
    for t in tasks:
        d = t.discipline or "Без дисциплины"
        grouped.setdefault(d, [])
        grouped[d].append({
            "id": t.id,
            "title": t.title,
            "deadline": t.deadline.strftime("%d.%m %H:%M"),
            "completed": t.status in ("done_on_time", "done_late"),
            "status_label": t.get_status_display(),
        })

    return JsonResponse(grouped)


from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def toggle_task(request, task_id):
    task = Task.objects.get(id=task_id)
    task.status = "done_on_time" if task.status == "active" else "active"
    task.save()
    return JsonResponse({"ok": True})


def calculate_streak(user):
    """Считает текущий стрик пользователя по дате выполнения задач"""
    stats, created = UserStats.objects.get_or_create(user=user)
    return stats.streak

def get_personal_tasks(user):
    """Возвращает задачи, которые не принадлежат ни к одной группе"""
    return Task.objects.filter(group__is_personal=True, group__members=user)

def get_group_tasks(user):
    """Возвращает словарь групп с задачами для пользователя"""
    groups = ClassGroup.objects.filter(members=user, is_personal=False)
    group_tasks = {}
    for group in groups:
        tasks = Task.objects.filter(group=group)
        group_tasks[group] = tasks
    return group_tasks

def dashboard(request):
    user = request.user
    
    # Статистика выполненных и просроченных задач
    total_done = UserTask.objects.filter(user=user, status__in=[UserTask.Status.DONE_ON_TIME, UserTask.Status.DONE_LATE]).count()
    expired = UserTask.objects.filter(user=user, status=UserTask.Status.EXPIRED).count()
    
    # Текущий стрик
    current_streak = calculate_streak(user)
    
    # Групповые и личные задачи
    group_tasks = get_group_tasks(user)
    personal_tasks = get_personal_tasks(user)
    
    return render(request, 'dashboard.html', {
        'total_done': total_done,
        'expired': expired,
        'current_streak': current_streak,
        'group_tasks': group_tasks,
        'personal_tasks': personal_tasks,
        'username': user,
    })

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class UserTaskViewSet(viewsets.ModelViewSet):
    queryset = UserTask.objects.all()
    serializer_class = UserTaskSerializer

class UserStatsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UserStats.objects.all()
    serializer_class = UserStatsSerializer
