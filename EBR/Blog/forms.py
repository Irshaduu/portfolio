from django import forms
from .models import Blog, BlogImage
from django.forms import inlineformset_factory
from django.contrib.auth.models import User


class BlogForm(forms.ModelForm):
    class Meta:
        model = Blog
        fields = ['name', 'description']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter blog name'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Write your blog content'}),
        }

BlogImageFormSet = inlineformset_factory(
    Blog,
    BlogImage,
    fields=('image',),
    extra=9,  # Number of empty image upload fields to show
    can_delete=False
)

class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']