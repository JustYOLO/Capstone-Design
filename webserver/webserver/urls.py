"""
URL configuration for webserver project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
from django.contrib import admin
from django.urls import include, path, re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.static import serve
from allauth.account.views import ConfirmEmailView
from accounts.views import HouseNameView
from accounts.views import BusinessRegisterView
from accounts.views import BusinessDataUpdateView
from accounts.views import PublicBusinessListView
from accounts.views import PublicBusinessDetailView
from accounts.views import BusinessImageUploadView

BUILD_DIR = os.path.join(settings.BASE_DIR, 'webserver', 'static', 'build')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include("dj_rest_auth.urls")),
    re_path(
        "^api/v1/auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),    
    path(
      "api/v1/florist/registration/",
      BusinessRegisterView.as_view(),
      name="business-register",
    ),
    path(
        'flowers.json',
        serve,
        {
            'path': 'flowers.json',
            'document_root': BUILD_DIR,
        },
        name='flowers-json'
    ),
    path(
        'robots.txt',
        serve,
        {
            'path': 'robots.txt',
            'document_root': BUILD_DIR,
        },
        name='robots-txt'
    ),
    path(
        "api/v1/florist/housename/",
        HouseNameView.as_view(),
        name="florist-housename",
    ),
    path(
      "api/v1/florist/data/",
      BusinessDataUpdateView.as_view(),
      name="business-data",
    ),
    path(
      "api/v1/florist/stores/",
      PublicBusinessListView.as_view(),
      name="public-business-list",
    ),
    path(
     "api/v1/florist/stores/<int:pk>/",
     PublicBusinessDetailView.as_view(),
     name="public-business-detail",
    ),
    path(
      "api/v1/florist/images/",
      BusinessImageUploadView.as_view(),
      name="business-image-upload",
    ),
    path('', include('frontend.urls')),
    re_path(r'^(?!static/).*$' , include('frontend.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=os.path.join(BASE_DIR, 'webserver/static/build/static'))
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
