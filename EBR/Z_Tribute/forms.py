#forms.py
from django import forms
from .models import Memory, Meme

class MemoryForm(forms.ModelForm):
    class Meta:
        model = Memory
        fields = ['name', 'review']

class MemeForm(forms.ModelForm):
    class Meta:
        model = Meme
        fields = ['name', 'image', 'caption']