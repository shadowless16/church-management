from rest_framework import serializers
from .models import Donation, Campaign
from members.serializers import MemberListSerializer

class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Donation
        fields = '__all__'
    
    def get_donor_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return f"{obj.donor.first_name} {obj.donor.last_name}"

class DonationListSerializer(serializers.ModelSerializer):
    """Simplified serializer for donation lists"""
    donor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Donation
        fields = ('id', 'donor_name', 'amount', 'date', 'type', 'method', 'campaign')
    
    def get_donor_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return f"{obj.donor.first_name} {obj.donor.last_name}"

class CampaignSerializer(serializers.ModelSerializer):
    total_raised = serializers.ReadOnlyField()
    progress_percentage = serializers.ReadOnlyField()
    donation_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Campaign
        fields = '__all__'
    
    def get_donation_count(self, obj):
        return obj.donations.count()
