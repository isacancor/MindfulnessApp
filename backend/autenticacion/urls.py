from django.urls import path
from .views import (
    LoginView, 
    ChangePasswordView,
    UserProfileView,
    UpdateProfileView,
    RegisterView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('password/', ChangePasswordView.as_view(), name='change-password'),
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('profile/', UpdateProfileView.as_view(), name='update-profile'),
]
