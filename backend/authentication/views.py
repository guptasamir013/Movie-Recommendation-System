from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserDetail(APIView):
    def get(self, request, format=None):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlacklistTokenView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message":"Successfully Logged Out"}, status=status.HTTP_205_RESET_CONTENT)
        except:
            return Response({"error":"Token already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)

class UpdatePasswordView(APIView):
    def post(self, request):
        print("Hello")
        password1 = request.data["password1"]
        password2 = request.data["password2"]
        if password1==password2:
            instance = request.user
            instance.set_password(password1)
            instance.save()
            return Response({"message":"Password Successfully Updated"}, status=status.HTTP_205_RESET_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
