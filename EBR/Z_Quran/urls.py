from django.urls import path
from . import views

app_name = 'Z_Quran'


urlpatterns = [
    path('', views.qr_base, name='qr_base'),
    path('english/', views.english, name='english'),
    path('malayalam/', views.malayalam, name='malayalam'),
    path('hindi/', views.hindi, name='hindi'),
    path('indonesian/', views.indonesian, name='indonesian'),
    path('arabic/', views.arabic, name='arabic'),

    path('Eng_anxious/', views.Eng_anxious, name='Eng_anxious'),
    path('Eng_happy/', views.Eng_happy, name='Eng_happy'),
    path('Eng_thankful/', views.Eng_thankful, name='Eng_thankful'),
    path('Eng_lonely/', views.Eng_lonely, name='Eng_lonely'),
    path('Eng_angry/', views.Eng_angry, name='Eng_angry'),
    path('Eng_sad/', views.Eng_sad, name='Eng_sad'),
    path('Eng_haram_tendency/', views.Eng_haram_tendency, name='Eng_haram_tendency'),

    path('Ml_anxious/', views.Ml_anxious, name='Ml_anxious'),
    path('Ml_happy/', views.Ml_happy, name='Ml_happy'),
    path('Ml_thankful/', views.Ml_thankful, name='Ml_thankful'),
    path('Ml_lonely/', views.Ml_lonely, name='Ml_lonely'),
    path('Ml_angry/', views.Ml_angry, name='Ml_angry'),
    path('Ml_sad/', views.Ml_sad, name='Ml_sad'),
    path('Ml_haram_tendency/', views.Ml_haram_tendency, name='Ml_haram_tendency'),

    path('Hi_anxious/', views.Hi_anxious, name='Hi_anxious'),
    path('Hi_happy/', views.Hi_happy, name='Hi_happy'),
    path('Hi_thankful/', views.Hi_thankful, name='Hi_thankful'),
    path('Hi_lonely/', views.Hi_lonely, name='Hi_lonely'),
    path('Hi_angry/', views.Hi_angry, name='Hi_angry'),
    path('Hi_sad/', views.Hi_sad, name='Hi_sad'),
    path('Hi_haram_tendency/', views.Hi_haram_tendency, name='Hi_haram_tendency'),

    path('In_anxious/', views.In_anxious, name='In_anxious'),
    path('In_happy/', views.In_happy, name='In_happy'),
    path('In_thankful/', views.In_thankful, name='In_thankful'),
    path('In_lonely/', views.In_lonely, name='In_lonely'),
    path('In_angry/', views.In_angry, name='In_angry'),
    path('In_sad/', views.In_sad, name='In_sad'),
    path('In_haram_tendency/', views.In_haram_tendency, name='In_haram_tendency'),

    path('Ar_anxious/', views.Ar_anxious, name='Ar_anxious'),
    path('Ar_happy/', views.Ar_happy, name='Ar_happy'),
    path('Ar_thankful/', views.Ar_thankful, name='Ar_thankful'),
    path('Ar_lonely/', views.Ar_lonely, name='Ar_lonely'),
    path('Ar_angry/', views.Ar_angry, name='Ar_angry'),
    path('Ar_sad/', views.Ar_sad, name='Ar_sad'),
    path('Ar_haram_tendency/', views.Ar_haram_tendency, name='Ar_haram_tendency'),


]