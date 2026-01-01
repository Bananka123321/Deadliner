from rest_framework import viewsets
from .models import Task, UserTask, UserStats, ClassGroup, GroupRole
from .serializers import TaskSerializer, UserTaskSerializer, UserStatsSerializer
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import TaskForm, ClassGroupForm

def home(request):
    if request.user.is_authenticated:
        return redirect('home_logged')
    else:
        return render(request, "tasks/home_guest.html")

@login_required
def home_logged(request):
    user = request.user
    groups = user.class_groups.all()

    total_done = UserTask.objects.filter(
        user=user,
        status__in=[UserTask.Status.DONE_ON_TIME, UserTask.Status.DONE_LATE]
    ).count()
    expired = UserTask.objects.filter(user=user, status=UserTask.Status.EXPIRED).count()
    current_streak = getattr(user.stats, "streak", 0) if hasattr(user, "stats") else 0

    group_tasks = {}
    for group in groups:
        user_tasks = UserTask.objects.filter(user=user, task__group=group).exclude(status__in=[UserTask.Status.DONE_ON_TIME, UserTask.Status.DONE_LATE]).order_by('task__deadline')[:3]
        group_tasks[group] = [ut.task for ut in user_tasks]

    context = {
        'user': user,
        'group_tasks': group_tasks,
        'total_done': total_done,
        'expired': expired,
        'current_streak': current_streak,
        'task_form': TaskForm(user=user),
        'group_form': ClassGroupForm(),
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

@csrf_exempt
def toggle_task(request, task_id):
    user_task = UserTask.objects.get(user=request.user, task_id=task_id)
    if user_task.is_done:
        user_task.is_done = False
    else:
        user_task.is_done = True
    user_task.save()
    return JsonResponse({"ok": True})


def calculate_streak(user):
    stats, created = UserStats.objects.get_or_create(user=user)
    return stats.streak

def get_group_tasks(user):
    groups = ClassGroup.objects.filter(members=user)
    group_tasks = {}

    for group in groups:
        user_tasks = UserTask.objects.filter(user=user, task__group=group).order_by('task__deadline')

        active_tasks = user_tasks.exclude(status__in=[UserTask.Status.DONE_ON_TIME, UserTask.Status.DONE_LATE])
        top_tasks = active_tasks[:3]

        group_tasks[group] = [
            {
                "id": ut.task.id,
                "title": ut.task.title,
                "deadline": ut.task.deadline.strftime("%d.%m %H:%M"),
                "completed": ut.status in (UserTask.Status.DONE_ON_TIME, UserTask.Status.DONE_LATE),
                "status_label": ut.get_status_display(),
            }
            for ut in top_tasks
        ]

    return group_tasks


def dashboard(request):
    user = request.user
    
    total_done = user.stats.total_done()
    expired = user.stats.total_expired()
    current_streak = user.stats.streak
    
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

@login_required
def group_detail(request, group_id):
    group = get_object_or_404(ClassGroup, id=group_id)
    user_tasks = UserTask.objects.filter(user=request.user, task__group=group).order_by('task__deadline')
    members = group.members.all()
    leaderboard = UserStats.objects.filter(user__in=members).order_by('-total_points')

    context = {
        'group': group,
        'tasks': user_tasks,
        'members': members,
        'leaderboard': leaderboard,
    }

    return render(request, 'tasks/group_detail.html', context)

@login_required
def create_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST, user=request.user)
        if form.is_valid():
            form.save()
            return redirect('home_logged')

    return redirect('home_logged')

@login_required
def create_group(request):
    if request.method == 'POST':
        form = ClassGroupForm(request.POST)
        if form.is_valid():
            # Сохраняем группу, но members добавим позже
            group = form.save()
            # Добавляем создателя в участники
            group.members.add(request.user)
            # Назначаем роль админа
            GroupRole.objects.create(user=request.user, group=group, role='admin')
            return redirect('home_logged')
    return redirect('home_logged')