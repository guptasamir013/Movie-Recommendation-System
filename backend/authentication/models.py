from django.db import models
from django.contrib.auth.models import AbstractUser
from picklefield.fields import PickledObjectField
# Create your models here.

class CustomUser(AbstractUser):
    image = models.ImageField(upload_to="profiles", blank=True)
    model = PickledObjectField(blank=True, null=True)
