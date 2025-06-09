from django.db import models
from django.core.validators import RegexValidator
import uuid

class Member(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('new', 'New'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$')],
        blank=True
    )
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    address = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    join_date = models.DateField()
    ministry = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='members/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    profession = models.CharField(max_length=100, blank=True)
    marital_status = models.CharField(max_length=50, blank=True)
    
    class Meta:
        db_table = 'members'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.member_id})"
    
    def save(self, *args, **kwargs):
        if not self.member_id:
            # Generate member ID
            last_member = Member.objects.order_by('-created_at').first()
            if last_member:
                last_id = int(last_member.member_id.split('-')[1])
                self.member_id = f"GC-{last_id + 1:04d}"
            else:
                self.member_id = "GC-1001"
        super().save(*args, **kwargs)

class Ministry(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    leader = models.ForeignKey(Member, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_ministries')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ministries'
        verbose_name_plural = 'Ministries'
    
    def __str__(self):
        return self.name
