from django.db import models
from django.contrib.auth.models import User
    
class Task(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    task_name=models.CharField(max_length=128)
    completed=models.BooleanField(default=False)
    scheduled_date=models.DateField()
    
    def to_dict(self):
        return {'id':self.id,'user':self.user.id,'task_name':self.task_name,
                'completed':self.completed,
                'scheduled_date':str(self.scheduled_date)
                }
    

class Subtask(models.Model):
    task=models.ForeignKey(Task,on_delete=models.CASCADE)
    subtask_name=models.CharField(max_length=128)
    completed=models.BooleanField(default=False)
    
    def to_dict(self):
        return {'id':self.id,'task':self.task.to_dict(),'subtask_name':self.subtask_name,'completed':self.completed}

class Quote(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    text=models.TextField()
    author=models.CharField(max_length=64)
    
    def to_dict(self):
        return {'id':self.id,'user':self.user.id,'text':self.text,'author':self.author}