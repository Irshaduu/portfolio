from django.urls import path
from . import views

app_name = 'Z_Calculator'

urlpatterns = [
    path('',views.calculate, name='calculate'),
]