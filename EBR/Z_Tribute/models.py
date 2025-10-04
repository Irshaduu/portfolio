#models.py
from django.db import models
from django.utils import timezone

class Memory(models.Model):
    name = models.CharField(max_length=100)
    review = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name}'s memory"

class Meme(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='memes/')
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Meme uploaded at {self.name}"
