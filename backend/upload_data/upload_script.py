import pandas as pd
from authentication.models import CustomUser
from movies.models import Movie, Rating
def addUsers():
    for id in range(1,611):
        username = id
        email = "default@gmail.com"
        password = "default@pass"
        user = CustomUser(username=username, email=email)
        user.set_password(password)
        user.save()

def addMovies():
    df = pd.read_csv("upload_data/movie_latest.csv")
    for i in range(len(df)):
        movie = Movie(title=df.title.iloc[i],
        feature1=df.iloc[i, 1],
        feature2=df.iloc[i, 2],
        feature3=df.iloc[i, 3],
        feature4=df.iloc[i, 4],
        feature5=df.iloc[i, 5],
        feature6=df.iloc[i, 6],
        feature7=df.iloc[i, 7],
        feature8=df.iloc[i, 8],
        feature9=df.iloc[i, 9],
        feature10=df.iloc[i, 10],
        feature11=df.iloc[i, 11],
        feature12=df.iloc[i, 12],
        feature13=df.iloc[i, 13],
        feature14=df.iloc[i, 14],
        feature15=df.iloc[i, 15],
        feature16=df.iloc[i, 16],
        feature17=df.iloc[i, 17],
        feature18=df.iloc[i, 18],
        feature19=df.iloc[i, 19],
        )
        movie.save()

def addRatings():
    df = pd.read_csv("upload_data/ratings_latest.csv")
    for i in range(len(df)):
        user = CustomUser.objects.get(id=df["userId"].iloc[i])
        movie = Movie.objects.get(id=df["movieId"].iloc[i])
        value = df["rating"].iloc[i]
        rating = Rating(value=value, user=user, movie=movie)
        rating.save()
