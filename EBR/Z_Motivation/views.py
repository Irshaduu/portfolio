# views.py
from django.shortcuts import render


def mot_home (request):
    return render(request,'mot_base.html')

def booster(request):
    return render(request, "Mot_index.html")

def daily_motivation(request):
    return render(request, "motivation.html",)

def progress_celebration(request):
    return render(request, "celebration.html",)


def hbooster(request):
    return render(request, "hindex.html")



def hdaily_motivation(request):
    return render(request, "hmotivation.html")

def hprogress_celebration(request):
    return render(request, "hcelebration.html")