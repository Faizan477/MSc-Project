from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    task_name=models.CharField(max_length=128)
    description=models.TextField()
    completed=models.BooleanField(default=False)
    scheduled_date=models.DateField()
    
    def to_dict(self):
        return {'id':self.id,'user':self.user.id,'task_name':self.task_name, 'description':self.description,
                'completed':self.completed,
                'scheduled_date':str(self.scheduled_date)
                }

class Subtask(models.Model):
    task=models.ForeignKey(Task,on_delete=models.CASCADE)
    subtask_name=models.CharField(max_length=128)
    description=models.TextField()
    completed=models.BooleanField(default=False)
    
    def to_dict(self):
        return {'id':self.id,'task':self.task.to_dict(),'subtask_name':self.subtask_name, 'description':self.description,'completed':self.completed}
    
class Quote(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    text=models.TextField()
    author=models.CharField(max_length=64)
    
    def to_dict(self):
        return {'id':self.id,'user':self.user.id,'text':self.text,'author':self.author}
    
class UserSetting(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    session_length=models.IntegerField(default=25)
    short_break_length=models.IntegerField(default=5)
    long_break_length=models.IntegerField(default=15)
    num_sessions=models.IntegerField(default=6)

class OverallConcentrationEvaluation(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    timestamp=models.DateTimeField()
    red=models.IntegerField(default=0)
    amber=models.IntegerField(default=0)
    green=models.IntegerField(default=0)
    
    def to_dict(self):
            return {'id':self.id,'user':self.user.id,'timestamp':self.timestamp, 'red':self.red,'amber':self.amber, 'green':self.green}

class CheckInEvaluation(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    timestamp=models.DateTimeField()
    focusing_value=models.FloatField(default=0)
     
    def to_dict(self):
                return {'id':self.id,'user':self.user.id,'timestamp':self.timestamp, 'focusing_value':self.focusing_value}
    
class DistractionsEvaluation(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    timestamp=models.DateTimeField()
    zoning_out=models.FloatField(default=0)
    phone=models.FloatField(default=0)
    starting_other_tasks=models.FloatField(default=0)
    eating=models.FloatField(default=0)
    
    def to_dict(self):
        return {'id':self.id,'user':self.user.id,'timestamp':self.timestamp, 'zoning_out':self.zoning_out,'phone':self.phone,'starting_other_tasks':self.starting_other_tasks,'eating':self.eating}

#needs PUT requests 
class LastTaskProgress(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    red_task_id=models.IntegerField()
    amber_task_id=models.IntegerField()
    improvement=models.TextField()
    
    def to_dict(self):
        return {'id':self.id,'user':self.user.id,'red_task_id':self.red_task_id, 'amber_task_id':self.amber_task_id,'improvement':self.improvement}
            
class CompletedSession(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    completed=models.BooleanField(default=False)
    
    def to_dict(self):
        return {'id':self.id,'user':self.user.id,'completed':self.completed}