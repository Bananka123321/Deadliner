from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import TaskViewSet, UserTaskViewSet, UserStatsViewSet

router = DefaultRouter()
router.register(r"tasks", TaskViewSet)
router.register(r"user-tasks", UserTaskViewSet)
router.register(r"user-stats", UserStatsViewSet)

urlpatterns = [
    path('api/', include(router.urls)),

    path('', views.home, name='home'),
    path('dashboard/', views.home_logged, name='home_logged'),
    path('group/<int:group_id>/', views.group_detail, name='group_detail'),
    
    path('tasks/create/', views.create_task, name='create_task'),
    path('groups/create/', views.create_group, name='create_group'),
    
    path('toggle-task/<int:task_id>/', views.toggle_task, name='toggle_task'),
    path('tasks/edit/<int:task_id>/', views.edit_task, name='edit_task'),

    path('group/<int:group_id>/add-member/', views.add_member_to_group, name='add_member_to_group'),
]
