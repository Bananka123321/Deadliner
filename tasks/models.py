from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError

class ClassGroup(models.Model):
    name = models.CharField(max_length=10)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_groups")
    members = models.ManyToManyField(User, related_name="class_groups")
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
            if len(self.name) > 10:
                raise ValidationError("Название группы не должно превышать 10 символов.")

    def __str__(self):
        return self.name

class GroupRole(models.Model):
    ROLE_CHOICES = [("admin", "Админ"),("member", "Участник"),]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="group_roles")
    group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE, related_name="user_roles")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")

    class Meta:
        unique_together = ("user", "group")

    def __str__(self):
        return f"{self.user.username} — {self.group.name} ({self.role})"

class Task(models.Model):
    title = models.CharField(max_length=35)
    description = models.TextField(blank=True)
    deadline = models.DateTimeField()
    group = models.ForeignKey(ClassGroup, on_delete=models.CASCADE)
    discipline = models.CharField(max_length=36, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    points = models.PositiveIntegerField(default=0)

    def clean(self):
            if len(self.title) > 35:
                raise ValidationError("Название задачи не должно превышать 35 символов.")
            if len(self.discipline) > 36:
                raise ValidationError("Название предмета не должно превышать 35 символов.")
        
    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new and self.group:
            for user in self.group.members.all():
                UserTask.objects.get_or_create(user=user, task=self)

class UserTask(models.Model):
    is_done = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_miss = models.BooleanField(default= False)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        DONE_ON_TIME = "done_on_time", "Done on time"
        DONE_LATE = "done_late", "Done late"
        EXPIRED = "expired", "Expired"

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    class Meta:
        unique_together = ("user", "task")

    def __str__(self):
        return f"{self.user.username} — {self.task.title}"
    
    def save(self, *args, **kwargs):
        was_done_before = False
        if self.pk:
            old = UserTask.objects.get(pk=self.pk)
            was_done_before = old.is_done

        if self.is_done and not was_done_before:
            self.completed_at = timezone.now()
            
            if hasattr(self.user, 'stats'):
                self.user.stats.add_points(self.task.points)

            self.user.stats.update_streak()

            if self.completed_at <= self.task.deadline:
                self.status = self.Status.DONE_ON_TIME
            else:
                self.status = self.Status.DONE_LATE

        elif not self.is_done and was_done_before:
            self.completed_at = None
            self.status = self.Status.ACTIVE
            
            if hasattr(self.user, 'stats'):
                self.user.stats.total_points = max(0, self.user.stats.total_points - self.task.points)
                self.user.stats.save()
                
        super().save(*args, **kwargs)

            
class UserStats(models.Model):
    streak = models.PositiveIntegerField(default=0)
    total_points = models.PositiveIntegerField(default=0)
    last_completed_date = models.DateField(null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="stats")


    def update_streak(self):
        today = timezone.now().date()
        if self.last_completed_date == today - timezone.timedelta(days=1):
            self.streak += 1
        elif self.last_completed_date == today:
            pass
        else:
            self.streak = 1
        self.last_completed_date = today
        self.save()

    def total_done(self):
        return UserTask.objects.filter(user=self.user, status__in=[UserTask.Status.DONE_ON_TIME, UserTask.Status.DONE_LATE]).count()

    def total_expired(self):
        return UserTask.objects.filter(user=self.user, status=UserTask.Status.EXPIRED).count()

    def add_points(self, points):
        self.total_points += points
        self.save()