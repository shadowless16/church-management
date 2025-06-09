from django.db import models
from members.models import Member
import uuid

class Donation(models.Model):
    TYPE_CHOICES = [
        ('tithe', 'Tithe'),
        ('offering', 'Offering'),
        ('special_gift', 'Special Gift'),
        ('building_fund', 'Building Fund'),
        ('missions', 'Missions'),
    ]
    
    METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('check', 'Check'),
        ('online', 'Online'),
        ('bank_transfer', 'Bank Transfer'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    donor = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES)
    campaign = models.CharField(max_length=100)
    reference_number = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    is_anonymous = models.BooleanField(default=False)
    receipt_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'donations'
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        donor_name = "Anonymous" if self.is_anonymous else str(self.donor)
        return f"{donor_name} - ${self.amount} ({self.date})"

class Campaign(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'campaigns'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def total_raised(self):
        return self.donations.aggregate(total=models.Sum('amount'))['total'] or 0
    
    @property
    def progress_percentage(self):
        if self.target_amount:
            return (self.total_raised / self.target_amount) * 100
        return 0
