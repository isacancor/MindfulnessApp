from django.urls import path
from .api import (
    login,
    change_password,
    user_profile,
    update_profile,
    register
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

# /api/auth/
urlpatterns = [
    path('login/', login, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    path('register/', register, name='register'),
    path('password/', change_password, name='change-password'),
    path('me/', user_profile, name='user-profile'),
    path('profile/', update_profile, name='update-profile'),
]
