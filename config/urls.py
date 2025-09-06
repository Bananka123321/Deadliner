from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks.views import UserTaskViewSet, task_list

router = DefaultRouter()
router.register(r'user-tasks', UserTaskViewSet, basename="user-task")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # API
    path('', task_list, name='home'),    # Главная страница
]
