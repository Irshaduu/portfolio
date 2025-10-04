from django.urls import path
from . import views
from .views import ReviewEmailView

app_name = 'Ecom'

urlpatterns = [
    path('',views.base, name='base'),
    path('base',views.base, name='base'),
    path('index',views.index, name='index'),
    path('product',views.product, name='product'),

    path('add',views.add, name='add'),
    path('deleteP/<int:pro>',views.deleteP, name='deleteP'),
    path('editP/<int:pro>',views.editP, name='editP'),
    path('searchP',views.searchP, name='searchP'),

    path('addC',views.addC, name='addC'),
    path('deleteC/<int:cat>',views.deleteC, name='deleteC'),
    path('editC/<int:cat>',views.editC, name='editC'),

    path('regi',views.regi, name='regi'),
    path('user_login',views.user_login, name='user_login'),

    path('ucategory',views.ucategory, name='ucategory'),
    path('uproduct',views.uproduct, name='uproduct'),

    path('user_logout', views.user_logout, name='user_logout'),  
    path('searchAdmin',views.searchAdmin, name='searchAdmin'),

    path('add-to-cart/<int:pro_id>', views.add_to_cart, name='add_to_cart'),
    path('cart', views.cart_view, name='cart'),
    path('remove-from-cart/<int:pro_id>', views.remove_from_cart, name='remove_from_cart'),

    # Reviews
    path('review', views.ReviewEmailView.as_view(), name="reviews"),

]