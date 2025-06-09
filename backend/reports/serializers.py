from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ('id', 'status', 'file_path', 'generated_by', 'completed_at')
    
    def get_generated_by_name(self, obj):
        return f"{obj.generated_by.first_name} {obj.generated_by.last_name}"

class ReportListSerializer(serializers.ModelSerializer):
    """Simplified serializer for report lists"""
    generated_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Report
        fields = ('id', 'title', 'type', 'status', 'generated_by_name', 'created_at', 'completed_at')
    
    def get_generated_by_name(self, obj):
        return f"{obj.generated_by.first_name} {obj.generated_by.last_name}"
