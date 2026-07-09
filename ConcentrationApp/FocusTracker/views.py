from django.shortcuts import render,redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from . import forms
from . import models
import json 

@login_required
def task(request,id):
    if(request.method=='DELETE'):
        for task in models.Task.objects.filter(user=request.user):
            if(task.id==id):
                task.delete()
                return JsonResponse({'deleted':True})
        return JsonResponse({'deleted':False})
    elif(request.method=='PUT'):
        request_body=json.loads(request.body)
        for task in models.Task.objects.filter(user=request.user):
            if(task.id==id):
                task.task_name=request_body['taskName']
                task.completed=request_body['completed']
                task.scheduled_date=request_body['scheduledDate']
                task.save()
                return JsonResponse({'edited':True})
            return JsonResponse({'edited':False})
            
    else:
        return JsonResponse({'error':True})

@login_required
def task_list(request):
    if(request.method=='POST'):
        request_body=json.loads(request.body)
        models.Task.objects.create(user=request.user,task_name=request_body['taskName'],scheduled_date=request_body['scheduledDate'])
        return JsonResponse({'created':'true'})
    date=request.GET.get('date')
    return JsonResponse([task.to_dict() for task in models.Task.objects.filter(user=request.user,scheduled_date=date)],safe=False)

@login_required
def subtask(request,id):    
    if request.method=='DELETE':
        for subtask in models.Subtask.objects.filter(task__user=request.user):
            if(subtask.id==id):
                subtask.delete()
                return JsonResponse({'deleted':True})
            return JsonResponse({'deleted':False})
    elif request.method=='PUT':
        request_body=json.loads(request.body)
        for subtask in models.Subtask.objects.filter(task__user=request.user):
            if(subtask.id==id):
                subtask.subtask_name=request_body['subtaskName']
                subtask.completed=request_body['completed']
                subtask.save()
                return JsonResponse({'edited':True})
            return JsonResponse({'edited':False})
    else:
        return JsonResponse({'error':True})

@login_required
def subtask_list(request):
    if request.method=='POST':
        request_body=json.loads(request.body)
        taskObject=models.Task.objects.get(id=request_body['task'])
        models.Subtask.objects.create(task=taskObject,subtask_name=request_body['subtaskName'])
        return JsonResponse({'created':True})
    date=request.GET.get('date')
    return JsonResponse([subtask.to_dict() for subtask in models.Subtask.objects.filter(task__user=request.user,task__scheduled_date=date)],safe=False)
        
def register(request):
    register_form=forms.RegisterForm()
    if request.method=='POST':
        register_form=forms.RegisterForm(request.POST)
        if(register_form.is_valid()):
            register_form.save()
            return redirect('http://localhost:5173/')
            
    return render(request,"register.html",{'registerForm':register_form})

def login_user(request):
    login_form=forms.AuthenticationForm
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')
        
        try_login_user=authenticate(username=username,password=password)
        if try_login_user is not None:
            login(request,try_login_user)
            print("Login successful")
            return redirect('http://localhost:5173/')
        else:
            return render(request,"login.html",{'loginForm':login_form,'msg':"Incorrect username or password. Please try again."})
    return render(request,"login.html",{'loginForm':login_form})

def check_if_authenticated(request):
    if(request.user.is_authenticated):
        return JsonResponse({'authenticated':True})
    else:
        return JsonResponse({'authenticated':False})

def logout_user(request):
    logout(request)
    return redirect('/')

def home(request):
    return render(request,"home.html")
