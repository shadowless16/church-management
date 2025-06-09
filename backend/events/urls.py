from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventListCreateView.as_view(), name='event_list_create'),
    path('<uuid:pk>/', views.EventDetailView.as_view(), name='event_detail'),
    path('upcoming/', views.upcoming_events, name='upcoming_events'),
    path('stats/', views.event_stats, name='event_stats'),
    path('<uuid:event_id>/attendance/', views.EventAttendanceListView.as_view(), name='event_attendance'),
    path('<uuid:event_id>/mark-attendance/', views.mark_attendance, name='mark_attendance'),
    path('calendar/', views.calendar_events, name='calendar_events'),
]
