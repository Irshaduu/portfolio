from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Blog, BlogImage
from .forms import BlogForm, BlogImageFormSet 
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from .forms import ProfileForm



@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('Blog:profile')
    else:
        form = ProfileForm(instance=request.user)
    return render(request, 'edit_profile.html', {'form': form})


@login_required
def profile(request):
    user = request.user
    return render(request, 'profile.html', {'user': user})


def trending_blogs(request):
    # Fetch blogs, annotate with like count, and sort by likes in descending order
    blogs = Blog.objects.annotate(like_count=Count('likes')).order_by('-like_count')
    return render(request, 'trending.html', {'blogs': blogs})


def like_blog(request, blo):
    blog = get_object_or_404(Blog, id=blo)
    if request.user.is_authenticated:
        if request.user in blog.likes.all():
            blog.likes.remove(request.user)  # Unlike
        else:
            blog.likes.add(request.user)     # Like
    # Redirect back to the same page (or change as needed)
    return redirect(request.META.get('HTTP_REFERER', reverse('Blog:home')))


@login_required
def liked_blogs(request):
    # Get all Blog instances that the current user has liked.
    blogs = request.user.liked_blogs.all()  # Using the related_name defined in the Blog model
    return render(request, 'liked_blogs.html', {'blogs': blogs})


@login_required
def my_blogs(request):
    my_blog = Blog.objects.filter(author=request.user)
    return render(request, 'my_blogs.html', {'blogs': my_blog})

@login_required
def blog_post(request):
    if request.method == 'POST':
        form = BlogForm(request.POST)
        formset = BlogImageFormSet(request.POST, request.FILES)

        if form.is_valid() and formset.is_valid():
            # Save the Blog instance but do not commit yet
            blog = form.save(commit=False)
            blog.author = request.user  # Set the blog's author
            blog.save()

            # Associate images with the blog
            formset.instance = blog
            formset.save()

            return redirect('Blog:home')
        else:
            return render(request, 'blog_post.html', {'form': form, 'formset': formset})
    else:
        form = BlogForm()
        formset = BlogImageFormSet()
    return render(request, 'blog_post.html', {'form': form, 'formset': formset})

#----------------------------------------------------------

def base(request):
    return render (request,'blog_base.html')

#----------------------------------------------------------

def user_registration(request):
    if request.method == 'POST':
        uname = request.POST['username']
        first = request.POST['fname']
        last = request.POST['lname']
        em = request.POST['email']
        password = request.POST['password']

        my_user = User.objects.create_user(username=uname, password=password, email=em)
        my_user.first_name= first
        my_user.last_name= last
        my_user.save()
        return redirect ('Blog:user_login')
    return render (request,'user_registration.html')

#----------------------------------------------------------

def user_login(request):
    if request.method == 'POST':
        uname = request.POST['username']
        password = request.POST['password']
        read = authenticate(username=uname, password=password)
        if read is not None:
            print(read)
            login(request, read)
            return redirect('Blog:home')
    return render(request, 'user_login.html')


def home(request):
    t = Blog.objects.all()
    return render (request,'home.html', {'blogs':t})


def user_logout(request):
    logout(request)
    return redirect('Blog:base')

#----------------------------------------------------------

@login_required
def delete(request,blo):
    p = Blog.objects.get(id=blo)
    p.delete()
    return redirect('Blog:home')

#----------------------------------------------------------

@login_required
def edit(request, blo):
    p = Blog.objects.get(id=blo)
    form = BlogForm(request.POST or None, request.FILES or None, instance=p)
    formset = BlogImageFormSet(request.POST or None, request.FILES or None, instance=p)
    
    if request.method == 'POST':
        if form.is_valid() and formset.is_valid():
            form.save()
            formset.save()
            return redirect('Blog:home')
    
    return render(request, 'edit.html', {'form': form, 'formset': formset})
