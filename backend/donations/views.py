from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from .models import Donation, Campaign
from .serializers import DonationSerializer, DonationListSerializer, CampaignSerializer

class DonationListCreateView(generics.ListCreateAPIView):
    """List all donations or create a new donation"""
    queryset = Donation.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'method', 'campaign']
    search_fields = ['donor__first_name', 'donor__last_name', 'reference_number']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date', '-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return DonationListSerializer
        return DonationSerializer

class DonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a donation"""
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def donation_stats(request):
    """Get donation statistics"""
    # Current month stats
    this_month = timezone.now().replace(day=1).date()
    next_month = (this_month.replace(day=28) + timedelta(days=4)).replace(day=1)
    
    total_this_month = Donation.objects.filter(
        date__gte=this_month,
        date__lt=next_month
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    # Last month stats
    last_month = (this_month - timedelta(days=1)).replace(day=1)
    total_last_month = Donation.objects.filter(
        date__gte=last_month,
        date__lt=this_month
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    # Calculate growth percentage
    growth_percentage = 0
    if total_last_month > 0:
        growth_percentage = ((total_this_month - total_last_month) / total_last_month) * 100
    
    # Average donation
    avg_donation = Donation.objects.aggregate(avg=Avg('amount'))['avg'] or Decimal('0')
    
    # Total donors
    total_donors = Donation.objects.values('donor').distinct().count()
    
    # Donation by type
    type_stats = Donation.objects.values('type').annotate(
        total=Sum('amount'),
        count=Count('id')
    )
    
    # Donation by method
    method_stats = Donation.objects.values('method').annotate(
        total=Sum('amount'),
        count=Count('id')
    )
    
    # Monthly trends (last 12 months)
    monthly_trends = []
    for i in range(12):
        month_start = (timezone.now().replace(day=1) - timedelta(days=30*i)).replace(day=1)
        month_end = (month_start.replace(day=28) + timedelta(days=4)).replace(day=1)
        
        month_total = Donation.objects.filter(
            date__gte=month_start,
            date__lt=month_end
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
        
        monthly_trends.append({
            'month': month_start.strftime('%Y-%m'),
            'total': float(month_total)
        })
    
    return Response({
        'total_this_month': float(total_this_month),
        'total_last_month': float(total_last_month),
        'growth_percentage': round(float(growth_percentage), 1),
        'average_donation': round(float(avg_donation), 2),
        'total_donors': total_donors,
        'type_distribution': list(type_stats),
        'method_distribution': list(method_stats),
        'monthly_trends': list(reversed(monthly_trends))
    })

class CampaignListCreateView(generics.ListCreateAPIView):
    """List all campaigns or create a new campaign"""
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

class CampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a campaign"""
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def campaign_donations(request, campaign_id):
    """Get all donations for a specific campaign"""
    try:
        campaign = Campaign.objects.get(id=campaign_id)
        donations = Donation.objects.filter(campaign=campaign.name)
        serializer = DonationListSerializer(donations, many=True)
        return Response({
            'campaign': CampaignSerializer(campaign).data,
            'donations': serializer.data
        })
    except Campaign.DoesNotExist:
        return Response({'error': 'Campaign not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def donor_report(request, donor_id):
    """Get donation report for a specific donor"""
    try:
        donations = Donation.objects.filter(donor_id=donor_id)
        total_donated = donations.aggregate(total=Sum('amount'))['total'] or Decimal('0')
        donation_count = donations.count()
        
        # Donations by type
        type_breakdown = donations.values('type').annotate(
            total=Sum('amount'),
            count=Count('id')
        )
        
        # Recent donations
        recent_donations = donations.order_by('-date')[:10]
        
        return Response({
            'donor_id': donor_id,
            'total_donated': float(total_donated),
            'donation_count': donation_count,
            'type_breakdown': list(type_breakdown),
            'recent_donations': DonationListSerializer(recent_donations, many=True).data
        })
    except Exception as e:
        return Response({'error': 'Donor not found'}, status=status.HTTP_404_NOT_FOUND)
