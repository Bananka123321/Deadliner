from django.utils import timezone
from datetime import timedelta
from .models import UserStats

def update_user_stats(user):
    stats, _ = UserStats.objects.get_or_create(user=user)
    today = timezone.now().date()

    if stats.last_completed_date == today - timedelta(days=1):
        stats.streak += 1
    elif stats.last_completed_date != today:
        stats.streak = 1

    stats.last_completed_date = today
    stats.total_completed += 1
    stats.save()
