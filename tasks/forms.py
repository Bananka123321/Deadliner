from django import forms
from .models import Task, ClassGroup

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'discipline', 'deadline', 'group', 'points']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Название задачи'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-textarea',
                'placeholder': 'Описание',
                'rows': 3
            }),
            'discipline': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Предмет'
            }),
            'deadline': forms.DateTimeInput(attrs={
                'type': 'datetime-local',
                'class': 'form-input'
            }),
            'group': forms.Select(attrs={
                'class': 'form-input'
            }),
            'points': forms.NumberInput(attrs={
                'class': 'form-input',
                'min': 0
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

        if user:
            self.fields['group'].queryset = ClassGroup.objects.filter(members=user)

class ClassGroupForm(forms.ModelForm):
    class Meta:
        model = ClassGroup
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control', 
                'placeholder': 'Название группы (макс. 10 симв.)'
            }),
        }