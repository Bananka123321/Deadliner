from django import forms
from django.contrib.auth.models import User
from .models import UserProfile, ClassGroup

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    class_group = forms.ModelChoiceField(
        queryset=ClassGroup.objects.all(),
        required=True,
        label="Выберите ваш класс"
    )

    class Meta:
        model = User
        fields = ["username", "password", "class_group"]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
            UserProfile.objects.create(
                user=user,
                class_group=self.cleaned_data["class_group"]
            )
        return user