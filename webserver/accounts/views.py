from dj_rest_auth.registration.views import RegisterView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, permissions
from .serializers import BusinessDataSerializer
from accounts.models import BusinessProfile, BusinessImage
from .serializers import BusinessRegisterSerializer
from .serializers import PublicBusinessSerializer
from .serializers import BusinessImageSerializer
from .serializers import BusinessInventorySerializer

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

class BusinessImageUploadView(generics.CreateAPIView):
    """
    POST /api/v1/florist/images/
    FormData: images=<file1>&images=<file2>&…
    """
    serializer_class = BusinessImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser]

    def perform_create(self, serializer):
        # link the uploaded image to the logged-in user’s profile
        serializer.save(profile=self.request.user.business_profile)

class BusinessInventoryView(APIView):
    """
    GET  /api/v1/florist/inventory/    → { "flowers": [...] }
    POST /api/v1/florist/inventory/    ← { "flowers": [...] }
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.business_profile
        return Response(
            {"flowers": profile.inventory},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = BusinessInventorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = request.user.business_profile
        profile.inventory = serializer.validated_data["flowers"]
        profile.save()
        return Response(
            {"flowers": profile.inventory},
            status=status.HTTP_200_OK,
        )
