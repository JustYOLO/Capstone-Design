from dj_rest_auth.registration.views import RegisterView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from accounts.models import BusinessProfile
from .serializers import BusinessRegisterSerializer
from .serializers import PublicBusinessSerializer

class BusinessRegisterView(RegisterView):
    serializer_class = BusinessRegisterSerializer
    parser_classes = [MultiPartParser, FormParser]

# Create your views here.

class HouseNameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.business_profile
        except BusinessProfile.DoesNotExist:
            return Response(
                {"detail": "You are not registered as a business user."},
                status=status.HTTP_403_FORBIDDEN
            )
        return Response({"housename": profile.company_name})

from rest_framework import generics, permissions
from .serializers import BusinessDataSerializer

class BusinessDataUpdateView(generics.RetrieveUpdateAPIView):
    """
    GET  /api/v1/florist/data/  → { "data": { ... } }
    PUT  /api/v1/florist/data/  ← { ...business JSON... }
    """
    serializer_class = BusinessDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Only business users have a profile
        return self.request.user.business_profile

class PublicBusinessListView(generics.ListAPIView):
    """
    GET /api/v1/florist/stores/
    Publicly list all verified businesses.
    """
    queryset = BusinessProfile.objects.filter(is_verified=True)
    serializer_class = PublicBusinessSerializer
    permission_classes = [permissions.AllowAny]

class PublicBusinessDetailView(generics.RetrieveAPIView):
    queryset = BusinessProfile.objects.filter(is_verified=True)
    serializer_class = PublicBusinessSerializer
    permission_classes = [permissions.AllowAny]