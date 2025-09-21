from django.contrib import admin
from .models import Task, ClassGroup, UserProfile

admin.site.register(Task)
admin.site.register(ClassGroup)
admin.site.register(UserProfile)