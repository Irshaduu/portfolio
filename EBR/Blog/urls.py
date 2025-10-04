from django.urls import path
from . import views

app_name = 'Blog'

urlpatterns = [
    path('',views.base, name='base'),
    path('user_registration',views.user_registration, name='user_registration'),
    path('user_login',views.user_login, name='user_login'),

    path('home', views.home, name='home'),
    path('user_logout', views.user_logout, name='user_logout'),
    path('blog_post',views.blog_post, name='blog_post'),

    path('delete/<int:blo>',views.delete, name='delete'),
    path('edit/<int:blo>',views.edit, name='edit'),

    path('like/<int:blo>', views.like_blog, name='like_blog'),
    
    path('liked_blogs', views.liked_blogs, name='liked_blogs'),
    path('my_blogs', views.my_blogs, name='my_blogs'),
    path('trending_blogs', views.trending_blogs, name='trending_blogs'),
    path('profile', views.profile, name='profile'),

    path('edit-profile', views.edit_profile, name='edit_profile'),
]