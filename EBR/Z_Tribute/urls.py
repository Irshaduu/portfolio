from django.urls import path
from . import views

app_name = 'Z_Tribute' 

urlpatterns = [
    path('', views.Tri_home, name='Tri_home'),
    path('special/', views.special, name='special'),
    path('message/', views.message, name='message'),
    path('share-memory/', views.share_memory, name='share_memory'),
    path('share-meme/', views.share_meme, name='share_meme'),
    path('memories/', views.memory_list, name='memory_list'),
    path('memes/', views.meme_list, name='meme_list'),
]