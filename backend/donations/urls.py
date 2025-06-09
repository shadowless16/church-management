from django.urls import path
from . import views

urlpatterns = [
    path('', views.DonationListCreateView.as_view(), name='donation_list_create'),
    path('<uuid:pk>/', views.DonationDetailView.as_view(), name='donation_detail'),
    path('stats/', views.donation_stats, name='donation_stats'),
    path('campaigns/', views.CampaignListCreateView.as_view(), name='campaign_list_create'),
    path('campaigns/<int:pk>/', views.CampaignDetailView.as_view(), name='campaign_detail'),
    path('campaigns/<int:campaign_id>/donations/', views.campaign_donations, name='campaign_donations'),
    path('donors/<uuid:donor_id>/report/', views.donor_report, name='donor_report'),
]
