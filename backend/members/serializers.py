from rest_framework import serializers
from .models import Member, Ministry

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'
        read_only_fields = ('id', 'member_id', 'created_at', 'updated_at')
    
    def validate_email(self, value):
        if self.instance:
            # Update case - exclude current instance
            if Member.objects.exclude(id=self.instance.id).filter(email=value).exists():
                raise serializers.ValidationError("A member with this email already exists.")
        else:
            # Create case
            if Member.objects.filter(email=value).exists():
                raise serializers.ValidationError("A member with this email already exists.")
        return value

class MemberListSerializer(serializers.ModelSerializer):
    """Simplified serializer for member lists"""
    class Meta:
        model = Member
        fields = ('id', 'member_id', 'first_name', 'last_name', 'email', 'phone', 
                 'status', 'ministry', 'join_date')

class MinistrySerializer(serializers.ModelSerializer):
    leader_name = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Ministry
        fields = '__all__'
    
    def get_leader_name(self, obj):
        if obj.leader:
            return f"{obj.leader.first_name} {obj.leader.last_name}"
        return None
    
    def get_member_count(self, obj):
        return Member.objects.filter(ministry__contains=obj.name).count()
