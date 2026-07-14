from django.contrib import admin
from .models import Task,Subtask,Quote

admin.site.register(Task)
admin.site.register(Subtask)
admin.site.register(Quote)
