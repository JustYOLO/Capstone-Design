from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
    NORMAL   = User.NORMAL
    BUSINESS = User.BUSINESS
    USER_TYPE_CHOICES = User.USER_TYPE_CHOICES

    user_type = serializers.ChoiceField(choices=USER_TYPE_CHOICES)

    def validate_email(self, email):
        # enforce unique, case‐insensitive email
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "A user with that email already exists."
            )
        return email

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data["user_type"] = self.validated_data.get("user_type")
        return data

