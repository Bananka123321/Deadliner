from django.contrib import admin
from django.utils import timezone
from .models import ClassGroup, GroupRole, Task, UserTask, UserStats

class GroupRoleInline(admin.TabularInline):
    model = GroupRole
    extra = 1
    autocomplete_fields = ["user"]
    fields = ["user", "role"]
    can_delete = True

@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "is_personal", "created_at")
    list_filter = ("is_personal",)
    search_fields = ("name",)
    filter_horizontal = ("members",)
    inlines = [GroupRoleInline]

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "group", "deadline", "discipline")
    list_filter = ("discipline", "group")
    search_fields = ("title",)

@admin.register(UserTask)
class UserTaskAdmin(admin.ModelAdmin):
    list_display = ("user", "task", "status", "is_done", "is_miss")
    list_filter = ("status", "is_done")
    actions = ["mark_as_done"]

    def mark_as_done(self, request, queryset):
        updated_count = 0
        for usertask in queryset:
            if not usertask.is_done:
                usertask.is_done = True
                usertask.completed_at = timezone.now()
                # Обновляем статус
                if usertask.completed_at <= usertask.task.deadline:
                    usertask.status = usertask.Status.DONE_ON_TIME
                else:
                    usertask.status = usertask.Status.DONE_LATE
                usertask.save()
                
                # Обновляем статистику пользователя
                stats, created = UserStats.objects.get_or_create(user=usertask.user)
                stats.update_stats()
                updated_count += 1
        self.message_user(request, f"{updated_count} задач(и) отмечены как выполненные и статистика обновлена.")
    mark_as_done.short_description = "Отметить выбранные задачи как выполненные"

@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    list_display = ("user", "streak", "total_completed", "last_completed_date")

admin.site.register(GroupRole)
