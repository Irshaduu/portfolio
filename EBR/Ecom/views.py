from django.shortcuts import render

# Ecom

from django.shortcuts import render,redirect, get_object_or_404
from django.http import HttpResponse
from .models import Category, Product
from .forms import ProductForm, CategoryForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout




def base(request):
    return render (request,'ecom_base.html')

def index(request):
    c = Category.objects.all()
    return render(request, 'index.html', {'cat':c})

def product(request):
    p =  Product.objects.all()
    return render(request, 'product.html', {'pro':p})


def ucategory(request):
    c = Category.objects.all()
    return render(request, 'ucategory.html', {'cat':c})


def uproduct(request):
    p =  Product.objects.all()
    return render(request, 'uproduct.html', {'pro':p})



def add(request):
    if request.method =='POST':
        pf = ProductForm(request.POST, request.FILES)
        if pf.is_valid():
            pf.save()
            return redirect('Ecom:product')
        else:
            return HttpResponse("Invalid Form")
    f= ProductForm()
    return render(request,'add.html', {'form':f})


def deleteP(request,pro):
    p = Product.objects.get(id=pro)
    p.delete()
    return redirect('Ecom:product')

def editP(request,pro):
    p = Product.objects.get(id=pro)
    f = ProductForm(request.POST or None, request.FILES or None, instance=p)
    if f.is_valid():
        f.save()
        return redirect('Ecom:product')
    return render (request,'add.html', {'form':f})


def searchP(request):
    s = request.POST['Pname']
    p = Product.objects.filter(name = s)
    return render(request,'uproduct.html',{'pro':p})


def searchAdmin(request):
    s = request.POST['Pname']
    p = Product.objects.filter(name = s)
    return render(request,'product.html',{'pro':p})


def addC(request):
    if request.method =='POST':
        cf = CategoryForm(request.POST, request.FILES)
        if cf.is_valid():
            cf.save()
            return redirect('Ecom:index')
        else:
            return HttpResponse("Invalid Form")
    f= CategoryForm()
    return render(request,'addC.html', {'form':f})

def deleteC(request,cat):
    c = Category.objects.get(id=cat)
    c.delete()
    return redirect('Ecom:index')

def editC(request,cat):
    c = Category.objects.get(id=cat)
    f = CategoryForm(request.POST or None, request.FILES or None, instance=c)
    if f.is_valid():
        f.save()
        return redirect('Ecom:index')
    return render (request,'addC.html', {'form':f})

    
from django.contrib.auth.models import User
from django.contrib import messages
from django.shortcuts import render, redirect

def regi(request):
    if request.method == 'POST':
        uname = request.POST['username']
        first = request.POST['fname']
        last = request.POST['lname']
        em = request.POST['email']
        password = request.POST['password']

        # Check if username already exists
        if User.objects.filter(username=uname).exists():
            messages.error(request, 'Username already exists. Please choose a different username.')
            return render(request, 'regi.html')
        
        # Check if email already exists
        if User.objects.filter(email=em).exists():
            messages.error(request, 'Email already registered. Please use a different email.')
            return render(request, 'regi.html')
        
        # Create user if validation passes
        try:
            my_user = User.objects.create_user(username=uname, password=password, email=em)
            my_user.first_name = first
            my_user.last_name = last
            my_user.save()
            messages.success(request, 'Registration successful! Please login.')
            return redirect('Ecom:user_login')
        except Exception as e:
            messages.error(request, f'An error occurred during registration: {str(e)}')
            return render(request, 'regi.html')
 
    return render(request, 'regi.html')


def user_login (request):
    if request.method=='POST':
        uname = request.POST['username']
        password = request.POST['password']
        read = authenticate(username=uname, password=password)
        if read is not None:
            print(read)
            login(request,read)
            return redirect('Ecom:ucategory')
   
    return render (request,'login.html')


def user_logout(request):
    logout(request)
    return redirect('Ecom:base')




def add_to_cart(request, pro_id):
    cart = request.session.get('cart', {})

    key = str(pro_id)
    if key in cart:
        cart[key] += 1 
    else:
        cart[key] = 1 

    request.session['cart'] = cart
    return redirect('Ecom:uproduct') 

def cart_view(request):
    cart = request.session.get('cart', {})
    cart_items = []
    total = 0

    for key, quantity in cart.items():
        product = get_object_or_404(Product, id=int(key))
        item_total = product.price * quantity
        total += item_total
        cart_items.append({
            'product': product,
            'quantity': quantity,
            'item_total': item_total,
        })

    return render(request, 'cart.html', {'cart_items': cart_items, 'total': total})

def remove_from_cart(request, pro_id):
    cart = request.session.get('cart', {})
    key = str(pro_id)
    if key in cart:
        del cart[key]
        request.session['cart'] = cart
    return redirect('Ecom:cart')


#-------------------------------------------

