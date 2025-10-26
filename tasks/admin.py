from django.contrib import admin
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

@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    list_display = ("user", "streak", "total_completed", "last_completed_date")

admin.site.register(GroupRole)

