from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse, Http404
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta
import csv
import json
import os

from .models import Report
from .serializers import ReportSerializer, ReportListSerializer
from members.models import Member
from events.models import Event, EventAttendance
from donations.models import Donation

class ReportListCreateView(generics.ListCreateAPIView):
    """List all reports or create a new report"""
    queryset = Report.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ReportListSerializer
        return ReportSerializer
    
    def perform_create(self, serializer):
        serializer.save(generated_by=self.request.user)

class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a report"""
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_membership_report(request):
    """Generate membership report"""
    try:
        # Get parameters
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        status_filter = request.data.get('status', 'all')
        
        # Create report record
        report = Report.objects.create(
            title=f"Membership Report - {timezone.now().strftime('%Y-%m-%d')}",
            type='membership',
            description='Detailed membership statistics and demographics',
            parameters={
                'start_date': start_date,
                'end_date': end_date,
                'status_filter': status_filter
            },
            generated_by=request.user,
            status='processing'
        )
        
        # Generate report data
        queryset = Member.objects.all()
        if start_date:
            queryset = queryset.filter(join_date__gte=start_date)
        if end_date:
            queryset = queryset.filter(join_date__lte=end_date)
        if status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        # Create CSV file
        filename = f"membership_report_{report.id}.csv"
        filepath = os.path.join('media', 'reports', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([
                'Member ID', 'First Name', 'Last Name', 'Email', 'Phone',
                'Gender', 'Status', 'Join Date', 'Ministry'
            ])
            
            for member in queryset:
                writer.writerow([
                    member.member_id,
                    member.first_name,
                    member.last_name,
                    member.email,
                    member.phone,
                    member.gender,
                    member.status,
                    member.join_date,
                    ', '.join(member.ministry) if member.ministry else ''
                ])
        
        # Update report status
        report.status = 'completed'
        report.file_path = filepath
        report.completed_at = timezone.now()
        report.save()
        
        return Response({
            'message': 'Report generated successfully',
            'report_id': str(report.id),
            'download_url': f'/api/reports/{report.id}/download/'
        })
        
    except Exception as e:
        if 'report' in locals():
            report.status = 'failed'
            report.save()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_financial_report(request):
    """Generate financial report"""
    try:
        # Get parameters
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        # Create report record
        report = Report.objects.create(
            title=f"Financial Report - {timezone.now().strftime('%Y-%m-%d')}",
            type='financial',
            description='Donation trends and financial summaries',
            parameters={
                'start_date': start_date,
                'end_date': end_date
            },
            generated_by=request.user,
            status='processing'
        )
        
        # Generate report data
        queryset = Donation.objects.all()
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        # Create CSV file
        filename = f"financial_report_{report.id}.csv"
        filepath = os.path.join('media', 'reports', filename)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow([
                'Date', 'Donor', 'Amount', 'Type', 'Method', 'Campaign', 'Reference'
            ])
            
            for donation in queryset:
                donor_name = "Anonymous" if donation.is_anonymous else str(donation.donor)
                writer.writerow([
                    donation.date,
                    donor_name,
                    donation.amount,
                    donation.type,
                    donation.method,
                    donation.campaign,
                    donation.reference_number
                ])
        
        # Update report status
        report.status = 'completed'
        report.file_path = filepath
        report.completed_at = timezone.now()
        report.save()
        
        return Response({
            'message': 'Report generated successfully',
            'report_id': str(report.id),
            'download_url': f'/api/reports/{report.id}/download/'
        })
        
    except Exception as e:
        if 'report' in locals():
            report.status = 'failed'
            report.save()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_report(request, report_id):
    """Download a generated report"""
    try:
        report = Report.objects.get(id=report_id)
        if report.status != 'completed' or not report.file_path:
            return Response({'error': 'Report not ready for download'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not os.path.exists(report.file_path):
            return Response({'error': 'Report file not found'}, status=status.HTTP_404_NOT_FOUND)
        
        with open(report.file_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(report.file_path)}"'
            return response
            
    except Report.DoesNotExist:
        raise Http404("Report not found")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """Get dashboard statistics"""
    # Member stats
    total_members = Member.objects.count()
    active_members = Member.objects.filter(status='active').count()
    new_this_month = Member.objects.filter(
        join_date__gte=timezone.now().replace(day=1).date()
    ).count()
    
    # Event stats
    upcoming_events = Event.objects.filter(date__gte=timezone.now().date()).count()
    events_this_month = Event.objects.filter(
        date__gte=timezone.now().replace(day=1).date()
    ).count()
    
    # Donation stats
    this_month = timezone.now().replace(day=1).date()
    donations_this_month = Donation.objects.filter(date__gte=this_month).aggregate(
        total=Sum('amount')
    )['total'] or 0
    
    # Recent activity
    recent_members = Member.objects.order_by('-created_at')[:5]
    recent_events = Event.objects.order_by('-created_at')[:5]
    recent_donations = Donation.objects.order_by('-created_at')[:5]
    
    return Response({
        'members': {
            'total': total_members,
            'active': active_members,
            'new_this_month': new_this_month
        },
        'events': {
            'upcoming': upcoming_events,
            'this_month': events_this_month
        },
        'donations': {
            'this_month': float(donations_this_month)
        },
        'recent_activity': {
            'members': [
                {
                    'id': str(m.id),
                    'name': f"{m.first_name} {m.last_name}",
                    'date': m.created_at.date()
                } for m in recent_members
            ],
            'events': [
                {
                    'id': str(e.id),
                    'title': e.title,
                    'date': e.date
                } for e in recent_events
            ],
            'donations': [
                {
                    'id': str(d.id),
                    'amount': float(d.amount),
                    'donor': "Anonymous" if d.is_anonymous else str(d.donor),
                    'date': d.date
                } for d in recent_donations
            ]
        }
    })
