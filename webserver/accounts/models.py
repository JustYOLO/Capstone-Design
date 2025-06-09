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
    inventory = models.JSONField(blank=True, default=list)

    def __str__(self):
        return f"{self.company_name} ({self.user.email})"

class BusinessImage(models.Model):
    profile = models.ForeignKey(
        "accounts.BusinessProfile", 
        on_delete=models.CASCADE, 
        related_name="images"
    )
    image = models.ImageField(upload_to="business_images/")

    def __str__(self):
        return f"Image for {self.profile.company_name}"


class Order(models.Model):
    business       = models.ForeignKey(
                        BusinessProfile,
                        on_delete=models.CASCADE,
                        related_name="orders",
                    )
    customer       = models.ForeignKey(
                        settings.AUTH_USER_MODEL,
                        null=True,
                        blank=True,
                        on_delete=models.SET_NULL,
                        related_name="orders_placed",
                    )
    customer_name  = models.CharField(max_length=255)
    customer_email = models.EmailField()
    items          = models.JSONField()
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} → {self.business.company_name}"
# Create your models here.
