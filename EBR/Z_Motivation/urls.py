from django.urls import path
from . import views

app_name = 'Z_Motivation' 

urlpatterns = [
    path('', views.mot_home, name='mot_home'),
    path('english/', views.booster, name='booster'),
    path('daily/', views.daily_motivation, name='daily_motivation'),
    path('celebrate/', views.progress_celebration, name='progress_celebration'),
    path('hindi/', views.hbooster, name='hbooster'),
    path('hdaily/', views.hdaily_motivation, name='hdaily_motivation'),
    path('hcelebrate/', views.hprogress_celebration, name='hprogress_celebration'),
]