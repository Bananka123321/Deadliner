from django.contrib import admin
from .models import Task, ClassGroup, UserTask, UserStats

admin.site.register(Task)
admin.site.register(UserTask)
admin.site.register(UserStats)

@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    filter_horizontal = ('members',)