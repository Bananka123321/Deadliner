from rest_framework import viewsets
from .models import Task, UserTask, UserStats, ClassGroup, GroupRole
from .serializers import TaskSerializer, UserTaskSerializer, UserStatsSerializer
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import TaskForm
from django.contrib import messages
from django.db.models import Count

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
    stats = user.stats
    
    total_done = user.stats.total_done()
    current_streak = stats.streak
    
    total_pending = user.tasks.filter(is_completed=False).count()
    
    total_tasks = total_done + total_pending
    progress_percent = int(total_done / total_tasks * 100) if total_tasks > 0 else 0
    
    higher_users_count = UserStats.objects.filter(completed_tasks_count__gt=total_done).count()
    rank = higher_users_count + 1
    
    return render(request, 'dashboard.html', {
        'total_done': total_done,
        'progress_percent': progress_percent,
        'rank': rank,
        'current_streak': current_streak,
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
        group_name = request.POST.get('name', '').strip()
        description = request.POST.get('description', '').strip()
        color = request.POST.get('color', 'blue')
        
        if not group_name:
            messages.error(request, 'Название группы обязательно для заполнения')
            return redirect('home_logged')
            
        if len(group_name) > 10:
            messages.error(request, 'Название группы не должно превышать 10 символов')
            return redirect('home_logged')
        
        try:
            group = ClassGroup.objects.create(name=group_name)
            
            GroupRole.objects.create(
                user=request.user,
                group=group,
                role='admin'
            )
            
            group.members.add(request.user)
            group.save()
            
            messages.success(request, f'Группа "{group_name}" успешно создана!')
            return redirect('home_logged')
            
        except Exception as e:
            messages.error(request, f'Ошибка при создании группы: {str(e)}')
            return redirect('home_logged')
    
    return redirect('home_logged')

@login_required
def get_calendar_tasks(request):
    user = request.user
    
    start_str = request.GET.get('start')
    end_str = request.GET.get('end')
    
    if start_str and end_str:
        try:
            start_date = timezone.datetime.fromisoformat(start_str)
            end_date = timezone.datetime.fromisoformat(end_str) + timezone.timedelta(days=1)
        except:
            start_date = timezone.now() - timezone.timedelta(days=30)
            end_date = timezone.now() + timezone.timedelta(days=30)
    else:
        today = timezone.now()
        start_date = timezone.datetime(today.year, today.month, 1)
        if today.month == 12:
            end_date = timezone.datetime(today.year + 1, 2, 1)
        else:
            end_date = timezone.datetime(today.year, today.month + 2, 1)
    
    user_tasks = UserTask.objects.filter(
        user=user,
        task__deadline__gte=start_date,
        task__deadline__lte=end_date
    ).select_related('task', 'task__group')
    
    tasks_data = []
    for ut in user_tasks:
        task = ut.task
        tasks_data.append({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'deadline': task.deadline.isoformat(),
            'discipline': task.discipline,
            'group': task.group.name if task.group else 'Без группы',
            'points': task.points,
            'isCompleted': ut.is_done,
            'isGroupTask': True if task.group else False
        })
    
    return JsonResponse(tasks_data, safe=False)