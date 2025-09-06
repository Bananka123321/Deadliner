from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)       # название
    description = models.TextField(blank=True)     # описание
    start_date = models.DateTimeField()            # когда можно начинать
    deadline = models.DateTimeField()              # дедлайн
    is_done = models.BooleanField(default=False)   # выполнено или нет

    def __str__(self):
        return self.title
