from django.db import models
from django.utils import timezone

# Ecome

class Category(models.Model):
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to='Category')
    discription = models.TextField()

    def __str__(self):
        return self.name
    

class Product(models.Model):
    name = models.CharField(max_length=50)
    image = models.FileField(upload_to='Product')
    description = models.TextField()
    price = models.FloatField()
    stock = models.IntegerField()
    date = models.DateTimeField(default=timezone.now)

    cat = models.ForeignKey(Category,on_delete=models.CASCADE)

    def __str__(self):
        return self.name
   