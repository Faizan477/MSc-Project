from django.urls import path
from . import views

urlpatterns=[
    path('',views.home,name='home'),
    path('register/',views.register,name='register'),
    path('login_user/',views.login_user,name='login_user'),
    path('check_if_authenticated/',views.check_if_authenticated,name='check_if_authenticated'),
    path('logout_user/',views.logout_user,name='logout_user'),
    path('tasks/<int:id>/',views.task,name='task'),
    path('task_completed/<int:id>/',views.task_completed,name='task_completed'),
    path('task_list/',views.task_list,name='task_list'),
    path('subtasks/<int:id>/',views.subtask,name='subtask'),
    path('subtask_list/',views.subtask_list,name='subtask_list'),
    path('subtask_completed/<int:id>/',views.subtask_completed,name='subtask_completed'),
]