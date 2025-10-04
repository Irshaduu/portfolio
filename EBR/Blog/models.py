from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Blog(models.Model):
    name = models.CharField(max_length=75)
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    likes = models.ManyToManyField(User, related_name='liked_blogs', blank=True)

    def __str__(self):
        return self.name

class BlogImage(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='blog_images')

    def __str__(self):
        return f"Image for {self.blog.name}"
