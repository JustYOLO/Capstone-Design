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
    """
    Extends your CustomRegisterSerializer (or directly RegisterSerializer)
    by adding a `file` field for PDF upload and running your PDF check.
    """

    file = serializers.FileField(write_only=True)

    def validate_file(self, uploaded_file):
        if not verify_pdf(uploaded_file):
            raise serializers.ValidationError("PDF verification failed")
        return uploaded_file

    def save(self, request):
        # 1) run the normal dj-rest-auth registration flow:
        user = super().save(request)

        # 2) pull the uploaded file out of validated_data
        pdf_file = self.validated_data.get("file")

        # 3) create the business profile
        BusinessProfile.objects.create(
            user=user,
            pdf=pdf_file,
            is_verified=True,  # or False until you manually review
        )

        return user

# class BusinessSignupSerializer(serializers.Serializer):
#     name     = serializers.CharField(max_length=150)
#     email    = serializers.EmailField()
#     password = serializers.CharField(write_only=True)
#     file     = serializers.FileField()
#
#     def validate_file(self, uploaded_file):
#         # runs your verify_pdf() on the incoming file object
#         if not verify_pdf(uploaded_file):
#             raise serializers.ValidationError("PDF verification failed")
#         return uploaded_file
#
#     def create(self, validated_data):
#         name     = validated_data.pop("name")
#         email    = validated_data.pop("email")
#         password = validated_data.pop("password")
#         pdf_file = validated_data.pop("file")
#
#         # 1) create the user
#         user = User.objects.create_user(
#             username=email,      # or however your User model is keyed
#             email=email,
#             password=password,
#             # if your User has a `name` field, set it here:
#             **({"name": name} if hasattr(User, "name") else {})
#         )
#
#         # 2) attach the PDF and mark as verified
#         BusinessProfile.objects.create(
#             user=user,
#             pdf=pdf_file,
#             is_verified=True,
#         )
#
#         return user
#
