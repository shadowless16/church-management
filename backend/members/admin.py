from django.contrib import admin
from .models import Member, Ministry

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('member_id', 'first_name', 'last_name', 'email', 'status', 'join_date')
    list_filter = ('status', 'gender', 'join_date', 'ministry')
    search_fields = ('member_id', 'first_name', 'last_name', 'email')
    ordering = ('-created_at',)
    readonly_fields = ('member_id', 'created_at', 'updated_at')

@admin.register(Ministry)
class MinistryAdmin(admin.ModelAdmin):
    list_display = ('name', 'leader', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
