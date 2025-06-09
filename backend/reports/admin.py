from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'status', 'generated_by', 'created_at', 'completed_at')
    list_filter = ('type', 'status', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('id', 'created_at', 'completed_at')
