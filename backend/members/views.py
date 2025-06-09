from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta

from .models import Member, Ministry
from .serializers import MemberSerializer, MemberListSerializer, MinistrySerializer

class MemberListCreateView(generics.ListCreateAPIView):
    """List all members or create a new member"""
    queryset = Member.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'gender']
    search_fields = ['first_name', 'last_name', 'email', 'member_id']
    ordering_fields = ['first_name', 'last_name', 'join_date', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return MemberListSerializer
        return MemberSerializer

class MemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a member"""
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def member_stats(request):
    """Get member statistics"""
    total_members = Member.objects.count()
    active_members = Member.objects.filter(status='active').count()
    inactive_members = Member.objects.filter(status='inactive').count()
    new_members = Member.objects.filter(status='new').count()
    
    # Members joined this month
    this_month = timezone.now().replace(day=1)
    new_this_month = Member.objects.filter(join_date__gte=this_month).count()
    
    # Members joined last month
    last_month = (this_month - timedelta(days=1)).replace(day=1)
    new_last_month = Member.objects.filter(
        join_date__gte=last_month,
        join_date__lt=this_month
    ).count()
    
    # Calculate growth percentage
    growth_percentage = 0
    if new_last_month > 0:
        growth_percentage = ((new_this_month - new_last_month) / new_last_month) * 100
    
    # Ministry distribution
    ministry_stats = {}
    for member in Member.objects.all():
        for ministry in member.ministry:
            ministry_stats[ministry] = ministry_stats.get(ministry, 0) + 1
    
    return Response({
        'total_members': total_members,
        'active_members': active_members,
        'inactive_members': inactive_members,
        'new_members': new_members,
        'new_this_month': new_this_month,
        'growth_percentage': round(growth_percentage, 1),
        'ministry_distribution': ministry_stats
    })

class MinistryListCreateView(generics.ListCreateAPIView):
    """List all ministries or create a new ministry"""
    queryset = Ministry.objects.all()
    serializer_class = MinistrySerializer
    permission_classes = [IsAuthenticated]

class MinistryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a ministry"""
    queryset = Ministry.objects.all()
    serializer_class = MinistrySerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ministry_members(request, ministry_id):
    """Get all members of a specific ministry"""
    try:
        ministry = Ministry.objects.get(id=ministry_id)
        members = Member.objects.filter(ministry__contains=ministry.name)
        serializer = MemberListSerializer(members, many=True)
        return Response({
            'ministry': ministry.name,
            'members': serializer.data
        })
    except Ministry.DoesNotExist:
        return Response({'error': 'Ministry not found'}, status=status.HTTP_404_NOT_FOUND)
