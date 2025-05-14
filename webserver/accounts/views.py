from dj_rest_auth.registration.views import RegisterView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import BusinessRegisterSerializer

class BusinessRegisterView(RegisterView):
    serializer_class = BusinessRegisterSerializer
    parser_classes = [MultiPartParser, FormParser]

# Create your views here.
