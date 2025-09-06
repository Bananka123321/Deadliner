from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    deadline = models.DateTimeField()

    def __str__(self):
        return self.title

class UserTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="user_tasks")
    is_done = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "task")

    def __str__(self):
        return f"{self.user.username} — {self.task.title}"
