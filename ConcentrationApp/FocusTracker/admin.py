from django.contrib import admin
from .models import Task,Subtask,Quote,OverallConcentrationEvaluation,CheckInEvaluation,DistractionsEvaluation,LastTaskProgress

admin.site.register(Task)
admin.site.register(Subtask)
admin.site.register(Quote)
admin.site.register(OverallConcentrationEvaluation)
admin.site.register(CheckInEvaluation)
admin.site.register(DistractionsEvaluation)
admin.site.register(LastTaskProgress)
