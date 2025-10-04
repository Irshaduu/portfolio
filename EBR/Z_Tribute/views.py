# views.py
from django.shortcuts import render, redirect
from .forms import MemoryForm, MemeForm
from .models import Memory, Meme

def Tri_home(request):
    return render(request, 'Tri_base.html')

def special(request):
    return render(request, "special.html")

def message(request):
    return render(request, "message.html")

def share_memory(request):
    if request.method == 'POST':
        form = MemoryForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('Z_Tribute:home')
    else:
        form = MemoryForm()
    return render(request, 'share_memory.html', {'form': form})

def share_meme(request):
    if request.method == 'POST':
        form = MemeForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('Z_Tribute:home')
    else:
        form = MemeForm()
    return render(request, 'share_meme.html', {'form': form})

def memory_list(request):
    memories = Memory.objects.all().order_by('-created_at')
    return render(request, 'memory_list.html', {'memories': memories})

def meme_list(request):
    memes = Meme.objects.all().order_by('-created_at')
    return render(request, 'meme_list.html', {'memes': memes})