from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, UserTaskViewSet, UserStatsViewSet

router = DefaultRouter()
router.register(r"tasks", TaskViewSet)
router.register(r"user-tasks", UserTaskViewSet)
router.register(r"user-stats", UserStatsViewSet)

urlpatterns = router.urls
