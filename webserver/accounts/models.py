from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    NORMAL   = "normal"
    BUSINESS = "business"
    USER_TYPE_CHOICES = [
        (NORMAL,   "Normal user"),
        (BUSINESS, "Business user"),
    ]

    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default=NORMAL,
    )

class BusinessProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="business_profile",
    )
    pdf = models.FileField(upload_to="business_pdfs/")
    company_name = models.CharField(max_length=255, blank=True)
    is_verified = models.BooleanField(default=False)
    data = models.JSONField(blank=True, default=dict)

    def __str__(self):
        return f"{self.company_name} ({self.user.email})"

# Create your models here.
