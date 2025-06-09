from django.urls import path
from . import views

urlpatterns = [
    path('', views.MemberListCreateView.as_view(), name='member_list_create'),
    path('<uuid:pk>/', views.MemberDetailView.as_view(), name='member_detail'),
    path('stats/', views.member_stats, name='member_stats'),
    path('ministries/', views.MinistryListCreateView.as_view(), name='ministry_list_create'),
    path('ministries/<int:pk>/', views.MinistryDetailView.as_view(), name='ministry_detail'),
    path('ministries/<int:ministry_id>/members/', views.ministry_members, name='ministry_members'),
]
