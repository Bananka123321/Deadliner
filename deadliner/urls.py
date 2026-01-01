"""
URL configuration for deadliner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from tasks import views as task_views
from django.contrib.auth.views import LogoutView
from tasks.views import toggle_task, group_tasks
from tasks.views import toggle_task, group_tasks, group_detail

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("tasks.urls")),
    path("", task_views.home, name="home"),
    path("dashboard/", task_views.home_logged, name="home_logged"),
    path("users/", include("users.urls")),
    path('logout/', LogoutView.as_view(next_page='home'), name='logout'),
    path("groups/<int:group_id>/tasks/", group_tasks, name="group_tasks_api"),
    path("tasks/<int:task_id>/toggle/", toggle_task),
    path('group/<int:group_id>/', task_views.group_detail, name='group_detail'),
    path('tasks/create/', task_views.create_task, name='create_task'),
]