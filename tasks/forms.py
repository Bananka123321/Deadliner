from django import forms
from django.contrib.auth.models import User
from .models import ClassGroup

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    class_group = forms.ModelChoiceField(queryset=ClassGroup.objects.all(), required=False)

    class Meta:
        model = User
        fields = ["username", "email", "password", "class_group"]

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
            if self.cleaned_data.get("class_group"):
                user.classgroup = self.cleaned_data["class_group"]
                user.save()
        return user