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
                task.description=request_body['taskDescription']
                task.completed=request_body['completed']
                task.scheduled_date=request_body['scheduledDate']
                task.save()
                return JsonResponse({'edited':True})
        return JsonResponse({'edited':False})
            
    else:
        return JsonResponse({'error':True})
    
@login_required
def task_completed(request,id):
    for task in models.Task.objects.filter(user=request.user):
        if(task.id==id):
            if(task.completed==False):
                task.completed=True
                task.save()
                for subtask in models.Subtask.objects.filter(task__user=request.user):
                    if(subtask.task.id==id):
                        subtask.completed=True
                        subtask.save()
                return JsonResponse({'completed':True})
            elif(task.completed==True):
                task.completed=False
                task.save()
                for subtask in models.Subtask.objects.filter(task__user=request.user):
                    if(subtask.task.id==id):
                        subtask.completed=False
                        subtask.save()
                return JsonResponse({'completed':False})
    return JsonResponse({'error':True})

@login_required
def subtask_completed(request,id):
    for subtask in models.Subtask.objects.filter(task__user=request.user):
        if(subtask.id==id):
            if(subtask.completed==False):
                subtask.completed=True
                subtask.save()
                taskObject=subtask.task
                for subtask in models.Subtask.objects.filter(task__user=request.user,task__id=taskObject.id):
                    if(subtask.completed==False):
                        return JsonResponse({'completed':True})
                taskObject.completed=True
                taskObject.save()
                return JsonResponse({'completed':True})
            elif(subtask.completed==True):
                subtask.completed=False
                subtask.save()
                taskObject=subtask.task
                for subtask in models.Subtask.objects.filter(task__user=request.user,task__id=taskObject.id):
                    if(subtask.completed==True):
                        return JsonResponse({'completed':False})
                taskObject.completed=False
                taskObject.save()
                return JsonResponse({'completed':False})
    return JsonResponse({'error':True})

@login_required
def task_list(request):
    if(request.method=='POST'):
        request_body=json.loads(request.body)
        models.Task.objects.create(user=request.user,task_name=request_body['taskName'],description=request_body['taskDescription'],scheduled_date=request_body['scheduledDate'])
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
                subtask.description=request_body['subtaskDescription']
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
        models.Subtask.objects.create(task=taskObject,subtask_name=request_body['subtaskName'],description=request_body['subtaskDescription'])
        return JsonResponse({'created':True})
    date=request.GET.get('date')
    return JsonResponse([subtask.to_dict() for subtask in models.Subtask.objects.filter(task__user=request.user,task__scheduled_date=date)],safe=False)

@login_required
def quote(request,id):
    if(request.method=='DELETE'):
        for quote in models.Quote.objects.filter(user=request.user):
            if(quote.id==id):
                quote.delete()
                return JsonResponse({'deleted':True})
        return JsonResponse({'deleted':False})
    elif(request.method=='PUT'):
        request_body=json.loads(request.body)
        print(request_body)
        print(models.Quote.objects.filter(user=request.user))
        for quote in models.Quote.objects.filter(user=request.user):
            if(quote.id==id):
                quote.text=request_body['editedText']
                quote.author=request_body['editedAuthor']
                quote.save()
                return JsonResponse({'edited':True})
        return JsonResponse({'edited':False})
            
    else:
        return JsonResponse({'error':True})

@login_required
def quote_list(request):
    if(request.method=='POST'):
        request_body=json.loads(request.body)
        models.Quote.objects.create(user=request.user,text=request_body['text'],author=request_body['author'])
        return JsonResponse({'created':'true'})
    return JsonResponse([quote.to_dict() for quote in models.Quote.objects.filter(user=request.user)],safe=False)

@login_required
def overall_concentration_evaluation(request):
    if request.method=='POST':
        request_body=json.loads(request.body)
        models.OverallConcentrationEvaluation.objects.create(user=request.user,timestamp=request_body['timestamp'],red=request_body['red'],amber=request_body['amber'],green=request_body['green'])
        return JsonResponse({'created':True})
    return JsonResponse([evaluation.to_dict() for evaluation in models.OverallConcentrationEvaluation.objects.filter(user=request.user).order_by('-timestamp')[:1]],safe=False)

@login_required
def overall_concentration_evaluation_graph(request):
    return JsonResponse([evaluation.to_dict() for evaluation in models.OverallConcentrationEvaluation.objects.filter(user=request.user).order_by('-timestamp')],safe=False)

@login_required
def check_in_evaluation(request):
    if request.method=='POST':
        request_body=json.loads(request.body)
        models.CheckInEvaluation.objects.create(user=request.user,timestamp=request_body['timestamp'],focusing_value=request_body['focusing_value'])
        return JsonResponse({'created':True})
    return JsonResponse([evaluation.to_dict() for evaluation in models.CheckInEvaluation.objects.filter(user=request.user).order_by('-timestamp')],safe=False)

@login_required
def distractions_evaluation(request):
    if request.method=='POST':
        request_body=json.loads(request.body)
        models.DistractionsEvaluation.objects.create(user=request.user,timestamp=request_body['timestamp'],zoning_out=request_body['zoning_out'],phone=request_body['phone'],starting_other_tasks=request_body['starting_other_tasks'],eating=request_body['eating'])
        return JsonResponse({'created':True})
    return JsonResponse([evaluation.to_dict() for evaluation in models.DistractionsEvaluation.objects.filter(user=request.user).order_by('-timestamp')[:1]],safe=False)

@login_required
def distractions_evaluation_graph(request):
    return JsonResponse([evaluation.to_dict() for evaluation in models.DistractionsEvaluation.objects.filter(user=request.user).order_by('-timestamp')],safe=False)

@login_required
def last_task_progress(request):
    if request.method=='PUT':
        request_body=json.loads(request.body)
        models.LastTaskProgress.objects.update_or_create(id=request.user.id,defaults={'id':request.user.id,'user':request.user,'red_task_id':request_body['red_task_id'],'amber_task_id':request_body['amber_task_id'],'improvement':request_body['improvement']})
        return JsonResponse({'created':True})
    return JsonResponse([entry.to_dict() for entry in models.LastTaskProgress.objects.filter(user=request.user)],safe=False)    

@login_required
def completed_sessions(request):
    if request.method=='PUT':
        request_body=json.loads(request.body)
        if(models.CompletedSession.objects.filter(user=request.user).count()==0):
            models.CompletedSession.objects.create(user=request.user,completed=request_body['completed'])
            return JsonResponse({'created':True})
        else:
            return JsonResponse({'created':False})
    elif request.method=='GET':
        if(models.CompletedSession.objects.filter(user=request.user).count()==0):
            return JsonResponse({'lastSessionExists':False})
        else:
            return JsonResponse({'lastSessionExists':True})

@login_required
def user_time_spent(request):
        if request.method=='PUT':
            request_body=json.loads(request.body)
            if(models.UserTimeSpent.objects.filter(user=request.user).count()==0):
                models.UserTimeSpent.objects.create(user=request.user,minutes_spent=request_body['minutes_spent'])
                return JsonResponse({'created':True})
            else:
                models.UserTimeSpent.objects.filter(user=request.user).update(minutes_spent=(models.UserTimeSpent.objects.get(user=request.user).minutes_spent+(request_body['minutes_spent'])))
                return JsonResponse({'created':True})
        elif request.method=='GET':
            return JsonResponse([evaluation.to_dict() for evaluation in models.UserTimeSpent.objects.filter(user=request.user)],safe=False)

def register(request):
    register_form=forms.RegisterForm()
    if request.method=='POST':
        register_form=forms.RegisterForm(request.POST)
        if(register_form.is_valid()):
            register_form.save()
            #MAKE THE ADD QUOTE REQUESTS HERE 
            return redirect('/dashboard')
            
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
            return redirect('/dashboard')
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
