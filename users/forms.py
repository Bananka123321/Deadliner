from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from tasks.models import ClassGroup

class CustomUserCreationForm(UserCreationForm):
    group = forms.ModelChoiceField(
        queryset=ClassGroup.objects.all(),
        required=False,
        label="Группа по умолчанию"
    )

    class Meta:
        model = User
        fields = [
            "username", "first_name", "last_name", "email",
            "password1", "password2", "group"
        ]
