from django.urls import path
from .views import *

urlpatterns = [
    path("list/", MovieListView.as_view(), name="movie-list"),
    path("detail/<str:pk>/", MovieDetailView.as_view(), name="movie-detail"),
    path("rating_list/<str:pk_movie>/", RatingListView.as_view(), name="movie-rating_list"),
    path("rating_detail/<str:pk>/", RatingDetailView.as_view(), name="movie-rating_detail"),
]
