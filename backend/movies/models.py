from django.db import models
from authentication.models import CustomUser
# Create your models here.
class Movie(models.Model):
    title = models.CharField(max_length=1000, blank=True)
    description = models.TextField(blank=True)
    feature1 = models.IntegerField()
    feature2 = models.IntegerField()
    feature3 = models.IntegerField()
    feature4 = models.IntegerField()
    feature5 = models.IntegerField()
    feature6 = models.IntegerField()
    feature7 = models.IntegerField()
    feature8 = models.IntegerField()
    feature9 = models.IntegerField()
    feature10 = models.IntegerField()
    feature11 = models.IntegerField()
    feature12 = models.IntegerField()
    feature13 = models.IntegerField()
    feature14 = models.IntegerField()
    feature15 = models.IntegerField()
    feature16 = models.IntegerField()
    feature17 = models.IntegerField()
    feature18 = models.IntegerField()
    feature19 = models.IntegerField()

    def __str__(self):
        return self.title

RATING_CHOICES = [(1,1),(2,2),(3,3),(4,4),(5,5)]
class Rating(models.Model):
    value = models.IntegerField(choices=RATING_CHOICES, blank=True)
    user = models.ForeignKey(to=CustomUser, related_name="ratings", on_delete=models.CASCADE)
    movie = models.ForeignKey(to=Movie, related_name="ratings", on_delete=models.CASCADE)
