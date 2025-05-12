from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import BusinessSignupSerializer

class BusinessSignupView(generics.CreateAPIView):
    """
    POST /api/v1/upload-pdf/
    {
      "email": "...",
      "password": "...",
      "pdf": <binary PDF file>
    }
    """
    serializer_class = BusinessSignupSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

# Create your views here.
