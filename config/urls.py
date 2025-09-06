from django.contrib import admin
from django.urls import path, include
from tasks.views import home, task_list, TaskViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name="home"),  # главная страница
    path('tasks/', task_list, name="task_list"),
    path('api/', include(router.urls)),
]
