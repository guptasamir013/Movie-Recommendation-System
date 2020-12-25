from django.urls import path
import rest_framework_simplejwt.views as jwt_views
from .views import *

urlpatterns = [
    path("token/obtain/", jwt_views.TokenObtainPairView.as_view(), name="authentication-token_obtain"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="authentication-token_refresh"),
    path("token/blacklist/", BlacklistTokenView.as_view(), name="authentication-token_blacklist"),
    path("register/", RegisterUserView.as_view(), name="authentication-register"),
    path("update_password/", UpdatePasswordView.as_view(), name="authentication-update_password"),
    path("userprofile/", UserDetail.as_view(), name="authentication-userprofile")
]
