from django.contrib import admin
from .models import Event, EventAttendance

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'start_time', 'location', 'ministry', 'status')
    list_filter = ('status', 'ministry', 'date', 'is_recurring')
    search_fields = ('title', 'description', 'location')
    ordering = ('-date', '-start_time')

@admin.register(EventAttendance)
class EventAttendanceAdmin(admin.ModelAdmin):
    list_display = ('event', 'member', 'attended', 'registered_at')
    list_filter = ('attended', 'registered_at')
    search_fields = ('event__title', 'member__first_name', 'member__last_name')
