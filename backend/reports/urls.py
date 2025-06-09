from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReportListCreateView.as_view(), name='report_list_create'),
    path('<uuid:pk>/', views.ReportDetailView.as_view(), name='report_detail'),
    path('generate/membership/', views.generate_membership_report, name='generate_membership_report'),
    path('generate/financial/', views.generate_financial_report, name='generate_financial_report'),
    path('<uuid:report_id>/download/', views.download_report, name='download_report'),
    path('dashboard-stats/', views.dashboard_stats, name='dashboard_stats'),
]
