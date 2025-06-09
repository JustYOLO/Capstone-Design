from allauth.account.adapter import DefaultAccountAdapter

class CustomAccountAdapter(DefaultAccountAdapter):
    def get_password_reset_url(self, request, uidb64, token):
        # Return your React SPA URL instead of using reverse()
        return f"https://blossompick.duckdns.org/password-reset/confirm?uid={uidb64}&token={token}"
