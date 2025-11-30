from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login
from .forms import CustomUserCreationForm

def register(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            group = form.cleaned_data.get("group")
            if group:
                group.members.add(user)

            login(request, user)
            messages.success(request, f"Аккаунт {user.username} создан!")
            return redirect("home")
    else:
        form = CustomUserCreationForm()


    return render(request, "users/register.html", {"form": form})

