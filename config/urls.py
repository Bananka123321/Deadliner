from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from tasks.views import UserTaskViewSet, task_list
from tasks import views

router = DefaultRouter()
router.register(r'user-tasks', views.UserTaskViewSet, basename="user-task")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # API
    path('accounts/', include('django.contrib.auth.urls')),  # логин/логаут
    path('register/', views.register, name='register'),      # регистрация
    path('', views.task_list, name='home'),    # Главная страница
]
