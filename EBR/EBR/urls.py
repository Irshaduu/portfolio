"""
URL configuration for EBR project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='welcome.html'), name='welcome'),
    path('my_skills/', TemplateView.as_view(template_name='my_skills.html'), name='my_skills'),
    path('ChatLink/', TemplateView.as_view(template_name='ChatLink.html'), name='ChatLink'),

    path('Blog/', include('Blog.urls')),
    path('Ecom/', include('Ecom.urls')),
    path('Z_Resume/', include('Z_Resume.urls')),
    path('Z_Calculator/', include('Z_Calculator.urls')),
    path('Z_Tribute/', include('Z_Tribute.urls')),
    path('Z_Motivation/', include('Z_Motivation.urls')),
    path('Z_Quran/', include('Z_Quran.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
