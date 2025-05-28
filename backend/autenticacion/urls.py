from django.urls import path
from .api import (
    login,
    change_password,
    user_profile,
    update_profile,
    register
)

urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('password/', change_password, name='change-password'),
    path('me/', user_profile, name='user-profile'),
    path('profile/', update_profile, name='update-profile'),
]
