from django.urls import path
from . import views

app_name = 'Z_Resume'

urlpatterns =[
    path('',views.indro, name='indro'),
    path('quiz',views.quiz, name='quiz'),
    path('ban',views.ban, name='ban'),
    path('notreal',views.notreal, name='notreal'),
    path('terms',views.terms, name='terms'),
    path('quiz1',views.quiz1, name='quiz1'),
    path('quiz2',views.quiz2, name='quiz2'),
    path('wrong',views.wrong, name='wrong'),
    path('quiz3',views.quiz3, name='quiz3'),
    path('resume',views.resume, name='resume'),
    path('gandhi',views.gandhi, name='gandhi'),
    path('mandela',views.mandela, name='mandela'),
    path('truman',views.truman, name='truman'),
    path('hitler',views.hitler, name='hitler'),
    path('stalin',views.stalin, name='stalin'),
    path('elizabeth',views.elizabeth, name='elizabeth'),
    path('donate',views.donate, name='donate'),
    path('indro',views.indro, name='indro'),

]