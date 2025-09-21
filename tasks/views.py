from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .models import Task, UserTask, UserStats, ClassGroup
from .forms import RegisterForm
from .utils import update_user_stats

@login_required
def task_list(request):
    user = request.user
    user_group = user.class_groups.first()
    
    study_tasks = Task.objects.filter(group=user_group, task_type="study") if user_group else Task.objects.none()
    personal_tasks = Task.objects.filter(created_by=user, task_type="personal")
    user_task_dict = {ut.task.id: ut.is_done for ut in UserTask.objects.filter(user=user)}
    participants = user_group.members.all() if user_group else []

    context = {
        "study_tasks": study_tasks,
        "personal_tasks": personal_tasks,
        "user_task_dict": user_task_dict,
        "participants": participants,
        "now": timezone.now(),
    }
    return render(request, "task_list.html", context)


@login_required
def toggle_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    user_task, created = UserTask.objects.get_or_create(user=request.user, task=task)
    if task.deadline < timezone.now():
        pass
    else:
        user_task.is_done = not user_task.is_done
        user_task.completed_at = timezone.now() if user_task.is_done else None
        user_task.save()

    return redirect('task_list') 


def register(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = RegisterForm()
    return render(request, "register.html", {"form": form})
