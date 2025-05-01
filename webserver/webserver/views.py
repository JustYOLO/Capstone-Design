from django.http import HttpResponse
from dj_rest_auth.registration.views import VerifyEmailView

class JSAlertVerifyEmailView(VerifyEmailView):
    def get(self, request, *args, **kwargs):
        # confirm the email via allauth
        self.kwargs['key'] = kwargs.get("key")
        confirmation = self.get_object()
        confirmation.confirm(request)

        # return tiny JS-alert page
        html = """
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"></head>
          <body>
            <script>
              alert("✅ Your email has been verified!");
              window.location.href = "/";
            </script>
          </body>
        </html>
        """
        return HttpResponse(html)

