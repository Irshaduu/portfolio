from django.contrib import admin
from .models import Blog, BlogImage

# Register your models here.

admin.site.register(Blog)
admin.site.register(BlogImage)