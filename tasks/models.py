from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class ClassGroup(models.Model):
    name = models.CharField(max_length=50, unique=True)
    members = models.ManyToManyField(User, related_name="class_groups", blank=True)

    def __str__(self):
        return self.name

class Task(models.Model):
    TASK_TYPE_CHOICES = [
        ("study", "Учебная"),
        ("personal", "Личная"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField()
    task_type = models.CharField(max_length=10, choices=TASK_TYPE_CHOICES, default="study")
    group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name="tasks", null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_tasks", null=True, blank=True)
    discipline = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.title} ({self.task_type})"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new and self.task_type == "study" and self.group:
            for user in self.group.members.all():
                UserTask.objects.get_or_create(user=user, task=self)



class UserTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="user_tasks")
    is_done = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "task")

    def __str__(self):
        return f"{self.user.username} — {self.task.title}"

class UserStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="stats")
    total_completed = models.PositiveIntegerField(default=0)
    streak = models.PositiveIntegerField(default=0)
    last_completed_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} — 🔥 {self.streak} дней, всего: {self.total_completed}"

def update_user_stats(user):
    stats, _ = UserStats.objects.get_or_create(user=user)
    today = timezone.now().date()

    if stats.last_completed_date == today - timezone.timedelta(days=1):
        stats.streak += 1
    elif stats.last_completed_date != today:
        stats.streak = 1
    stats.last_completed_date = today
    stats.total_completed += 1
    stats.save()