from django.contrib.auth.models import AbstractUser
from django.db import models

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

# Create your models here.
