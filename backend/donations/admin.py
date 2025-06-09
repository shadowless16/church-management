from django.contrib import admin
from .models import Donation, Campaign

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('donor', 'amount', 'date', 'type', 'method', 'campaign')
    list_filter = ('type', 'method', 'date', 'is_anonymous')
    search_fields = ('donor__first_name', 'donor__last_name', 'reference_number')
    ordering = ('-date', '-created_at')

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'target_amount', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active', 'start_date')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
