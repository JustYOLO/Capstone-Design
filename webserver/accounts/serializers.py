from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import BusinessProfile
from .verify import verify_pdf  # your existing function


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

class BusinessRegisterSerializer(RegisterSerializer):
    file = serializers.FileField(write_only=True)

    def validate(self, attrs):
        pdf_file = attrs.get("file")
        is_active, company_name = verify_pdf(pdf_file)
        if not is_active:
            raise serializers.ValidationError({
                "file": "PDF verification failed or business not active."
            })
        # attach the extracted name so save() can use it
        attrs["company_name"] = company_name
        return super().validate(attrs)

    def save(self, request):
        # 1) run normal user creation & email‐confirmation
        user = super().save(request)
        # 2) create the profile with both pdf and company_name
        BusinessProfile.objects.create(
            user=user,
            pdf=self.validated_data["file"],
            company_name=self.validated_data["company_name"],
            is_verified=True,
        )
        return user

class BusinessDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = ["data"]
