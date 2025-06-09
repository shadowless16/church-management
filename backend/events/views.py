from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Event, EventAttendance
from .serializers import EventSerializer, EventListSerializer, EventAttendanceSerializer

class EventListCreateView(generics.ListCreateAPIView):
    """List all events or create a new event"""
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'ministry', 'is_recurring']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'start_time', 'created_at']
    ordering = ['date', 'start_time']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return EventListSerializer
        return EventSerializer

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an event"""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_events(request):
    """Get upcoming events"""
    today = timezone.now().date()
    events = Event.objects.filter(date__gte=today).order_by('date', 'start_time')[:10]
    serializer = EventListSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_stats(request):
    """Get event statistics"""
    total_events = Event.objects.count()
    upcoming_events = Event.objects.filter(date__gte=timezone.now().date()).count()
    completed_events = Event.objects.filter(status='completed').count()
    
    # Events this month
    this_month = timezone.now().replace(day=1).date()
    events_this_month = Event.objects.filter(date__gte=this_month).count()
    
    # Average attendance
    avg_attendance = EventAttendance.objects.filter(attended=True).count() / max(completed_events, 1)
    
    # Ministry distribution
    ministry_stats = Event.objects.values('ministry').annotate(count=Count('ministry'))
    
    return Response({
        'total_events': total_events,
        'upcoming_events': upcoming_events,
        'completed_events': completed_events,
        'events_this_month': events_this_month,
        'average_attendance': round(avg_attendance, 1),
        'ministry_distribution': list(ministry_stats)
    })

class EventAttendanceListView(generics.ListCreateAPIView):
    """List event attendances or register for an event"""
    serializer_class = EventAttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return EventAttendance.objects.filter(event_id=event_id)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_attendance(request, event_id):
    """Mark attendance for an event"""
    try:
        event = Event.objects.get(id=event_id)
        member_ids = request.data.get('member_ids', [])
        
        for member_id in member_ids:
            attendance, created = EventAttendance.objects.get_or_create(
                event=event,
                member_id=member_id,
                defaults={'attended': True}
            )
            if not created:
                attendance.attended = True
                attendance.save()
        
        return Response({'message': 'Attendance marked successfully'})
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendar_events(request):
    """Get events for calendar view"""
    start_date = request.GET.get('start')
    end_date = request.GET.get('end')
    
    queryset = Event.objects.all()
    if start_date:
        queryset = queryset.filter(date__gte=start_date)
    if end_date:
        queryset = queryset.filter(date__lte=end_date)
    
    events = []
    for event in queryset:
        events.append({
            'id': str(event.id),
            'title': event.title,
            'start': f"{event.date}T{event.start_time}",
            'end': f"{event.date}T{event.end_time}",
            'backgroundColor': '#4f46e5' if event.status == 'scheduled' else '#6b7280',
            'borderColor': '#4f46e5' if event.status == 'scheduled' else '#6b7280',
        })
    
    return Response(events)
