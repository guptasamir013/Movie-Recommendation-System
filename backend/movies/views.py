from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .models import Rating, Movie
from .serializers import RatingSerializer, MovieSerializer
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import time
from functools import lru_cache
from datetime import datetime, timedelta
import asyncio
from asgiref.sync import sync_to_async
import threading
import multiprocessing
# Create your views here.

class _HashedSeq(list):
    """ This class guarantees that hash() will be called no more than once
        per element.  This is important because the lru_cache() will hash
        the key multiple times on a cache miss.
    """

    __slots__ = 'hashvalue'

    def __init__(self, tup, hash=hash):
        self[:] = tup
        self.hashvalue = hash(tup)

    def __hash__(self):
        return self.hashvalue

def make_key(args, kwds, typed=False,
             kwd_mark = (object(),),
             fasttypes = {int, str, frozenset, type(None)},
             tuple=tuple, type=type, len=len):
    """Make a cache key from optionally typed positional and keyword arguments
    The key is constructed in a way that is flat as possible rather than
    as a nested structure that would take more memory.
    If there is only a single argument and its data type is known to cache
    its hash value, then that argument is returned without a wrapper.  This
    saves space and improves lookup speed.
    """
    key = args
    if kwds:
        key += kwd_mark
        for item in kwds.items():
            key += item
    if typed:
        key += tuple(type(v) for v in args)
        if kwds:
            key += tuple(type(v) for v in kwds.values())
    elif len(key) == 1 and type(key[0]) in fasttypes:
        return key[0]
    return _HashedSeq(key)

def lru_fake():
    def decorator(func):
        cache = {}
        cache2 = {}

        def function_that_downloads(*args, **kwds):
            #print(key)
            # print(args)
            # print(kwds)
            #print(some_args)
            key = make_key(args, kwds)
            time.sleep(5)
            cache[key] = func(*args, **kwds)
            print("done")
            cache2[key] = False
            return

        def my_inline_function(*args, **kwds):
            print(args)
            print(kwds)
            # do some stuff
            change_thread = threading.Thread(target=function_that_downloads, name="Downloader", kwargs=kwds, args=args)
            change_thread.start()
            # continue doing stuff
            return change_thread

        def wrapper(*args, **kwds):
            key = make_key(args, kwds)
            result = cache.get(key)
            if result is None:
                cache[key] = func(*args, **kwds)
                result = cache.get(key)
                cache2[key] = False
            else:
                print("Hello")
                print("Try")
                if cache2.get(key)==False:
                    cache2[key] = True
                    my_inline_function(*args, **kwds)
                else:
                    print("already in process")
                print("Threading Threaded")
            # async def fetcher(user):
            #     print("Hello Fetcher")
            #     cache[user] = func(user)
            # async def main(user):
            #     fetch = loop.create_task(fetcher(user))
            #
            # result = cache.get(user)
            # if result is None:
            #     cache[user] = func(user)
            #     result = cache.get(user)
            # else:
            #     print("Hello")
            #     print("Try")
            #     loop = asyncio.new_event_loop()
            #     asyncio.set_event_loop(loop)
            #     loop = asyncio.get_event_loop()
            #     x = loop.run_until_complete(main(user))
            #     loop.close()
            #     print(x)
            return result
        return wrapper
    return decorator

def lru_time(lifetime, maxsize):
    def decorator(func):
        func = lru_cache(maxsize=maxsize)(func)
        func.lifetime = timedelta(seconds = lifetime)
        func.expiration = func.lifetime + datetime.utcnow()

        def function_that_downloads(my_args):
            time.sleep(20)
            print("done")
            return

        def my_inline_function(some_args):
            # do some stuff
            change_thread = threading.Thread(target=function_that_downloads, name="Downloader", args=some_args)
            change_thread.start()
            # continue doing stuff
            return change_thread

        #func.thread_func = threading.Thread(target=func, name="TrainerPredicter", args=some_args)
        def wrapper(*args, **kwargs):
            if(func.expiration<=datetime.utcnow()):
                func.cache_clear()
                func.expiration = func.lifetime + datetime.utcnow()
            return func(*args, **kwargs)
        return wrapper
    return decorator


#train_predict = lru_time(lifetime=2000, maxsize=128)(train_predict)
# @lru_time(lifetime=20000, maxsize=128)
@lru_fake()
def train_predict(user):
    print("Train Predict Called")
    dfr = pd.DataFrame(list(Rating.objects.filter(user=user).values()))
    print(dfr)
    if len(dfr)==0:
        return []
    df = pd.DataFrame(list(Movie.objects.all().values()))

    X = []
    # print(dfr.columns)
    for id in dfr.movie_id:
        X.append(list(df.drop(["title", "id", "description"], axis=1)[df.id==id].iloc[0, :]))

    Y = dfr.value
    model = LinearRegression(normalize=True)
    model.fit(X, Y)
    # return []

    X_df = df[~df.id.isin(dfr.movie_id)]
    X_df.reset_index(drop=True, inplace=True)
    X_test = X_df.drop(["title", "id", "description"], axis=1)

    if len(X_test)==0:
        return []

    predictions = model.predict(X_test)
    sorted_index = np.argsort(predictions)[::-1]
    # print(max(X_df.index))
    # return []

    ratedIds = X_df.id[sorted_index]
    if len(ratedIds)>=20:
         return ratedIds[:20]
    else:
        return ratedIds

def train(user):

    dfr = pd.DataFrame(list(Rating.objects.filter(user=user).values()))
    if len(dfr)==0:
        return
    df = pd.DataFrame(list(Movie.objects.all().values()))

    X = []
    # print(dfr.columns)
    for id in dfr.movie_id:
        X.append(list(df.drop(["title", "id", "description"], axis=1)[df.id==id].iloc[0, :]))
    print("Hello")
    Y = dfr.value
    model = LinearRegression(normalize=True)
    model.fit(X, Y)

    user.model = model
    user.save()


def predict(user):
    # time.sleep(10)
    print("hello")
    model = user.model
    if not model:
        return []

    dfr = pd.DataFrame(list(Rating.objects.filter(user=user).values()))
    if len(dfr)==0:
        return []
    df = pd.DataFrame(list(Movie.objects.all().values()))

    X_df = df#[~df.id.isin(dfr.movie_id)]
    X_df.reset_index(drop=True, inplace=True)
    X_test = X_df.drop(["title", "id", "description"], axis=1)

    if len(X_test)==0:
        return []

    predictions = model.predict(X_test)
    sorted_index = np.argsort(predictions)[::-1]
    # print(max(X_df.index))
    # return []

    ratedIds = X_df.id[sorted_index]
    if len(ratedIds)>=20:
         return ratedIds[:20]
    else:
        return ratedIds


class MovieListView(APIView):
    #Later it will just be recommended movies

    cache = {}
    def get(self, request):
        recommendedList = train_predict(request.user)
        # recommendedList = MovieListView.cache.get(request.user)
        # if recommendedList is None:
        #     MovieListView.cache[request.user] = train_predict(request.user)
        #     recommendedList = MovieListView.cache.get(request.user)
        # else:
        #     print("Hi")
            # async def fetcher(user):
            #     print("Hello Fetcher")
            #     MovieListView.cache[user] = train_predict(user)
            # async def main(user):
            #     fetch = loop.create_task(fetcher(user))
            #
            # print("Hello")
            # print("Try")
            # loop = asyncio.new_event_loop()
            # asyncio.set_event_loop(loop)
            # loop = asyncio.get_event_loop()
            # x = loop.run_until_complete(main(request.user))
            # loop.close()
            # print(x)

        # async def fetcher(user):
        #     print("Hello Fetcher")
        #     #MovieListView.cache[user] = train_predict(user)
        # async def main(user):
        #     fetch = loop.create_task(fetcher(user))
        #
        # print("Hello")
        # print("Try")
        # loop = asyncio.new_event_loop()
        # asyncio.set_event_loop(loop)
        # loop = asyncio.get_event_loop()
        # x = loop.run_until_complete(main(request.user))
        # loop.close()
        # print(x)

        # recommendedList = train_predict(request.user)
        # loop = asyncio.get_event_loop()
        # recommendedList = loop.run_until_complete(train_predict(request.user))
        # loop.close()



        # async def catcher():
        #     print("catcher")
        #     return "catcher"

        # async def main(user):
        #     print("Main Start")
        #     def fetcher(user):
        #         #await asyncio.sleep(2)
        #         time.sleep(3)
        #         print("fetcher")
        #         #MovieListView.cache[user] = train_predict(user)
        #         return "fetcher"
        #     num1 = loop.run_in_executor(None, fetcher, user)
        #     # num2 = loop.create_task(catcher())
        #     response1 = await num1
        #     print("Main Done")
        #     #await asyncio.wait([num1])
        #     # return "Hi"
        #
        #     def reco_ibm(lang):
        #         time.sleep(10)
        #         return lang
        #     future1 = loop.run_in_executor(None, reco_ibm, "English")
        #     future2 = loop.run_in_executor(None, reco_ibm, "Hindi")
        #     response1 = await future1
        #     response2 = await future2
        #     return [response1, response2]
        # loop = asyncio.new_event_loop()
        # asyncio.set_event_loop(loop)
        # loop = asyncio.get_event_loop()
        # x = loop.run_until_complete(main(request.user))
        # loop.close()
        # print(x)


        # def function_that_downloads(my_args):
        #     time.sleep(20)
        #     print("done")
        #     return
        #
        # def my_inline_function(some_args):
        #     # do some stuff
        #     download_thread = threading.Thread(target=function_that_downloads, name="Downloader", args=some_args)
        #     download_thread.start()
        #     # continue doing stuff
        #     return download_thread
        #
        # my_inline_function(["Hell"])

        movies = Movie.objects.filter(pk__in=recommendedList)
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MovieDetailView(APIView):
    def get(self, request, pk):
        try:
            movie = Movie.objects.get(pk=pk)
            serializer = MovieSerializer(movie)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"data":"No Data Found"}, status=status.HTTP_404_NOT_FOUND)

class RatingListView(APIView):
    def get(self, request, pk_movie, format=None):
        try:
            movie = Movie.objects.get(pk=pk_movie)
            rating = Rating.objects.filter(movie=movie.id).get(user=request.user.id)
            print("Hi")
            serializer = RatingSerializer(rating)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"data":"No Data Found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk_movie, format=None):
        try:

            movie = Movie.objects.get(pk=pk_movie)

            # rating = Rating.objects.filter(movie=movie).get(user=request.user)
            data = request.data
            serializer = RatingSerializer(data=data)
            if serializer.is_valid():
                serializer.save(movie=movie, user=request.user)
                # time.sleep(10)
                # train(request.user)
                return Response(serializer.data)
            # time.sleep(20)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            # time.sleep(20)
            return Response({"data":"No Data Found"}, status=status.HTTP_404_NOT_FOUND)

class RatingDetailView(APIView):
    def put(self, request, pk):
        try:
            rating = Rating.objects.get(pk=pk)
            data = request.data
            serializer = RatingSerializer(rating, data=data)
            if serializer.is_valid():
                serializer.save()
                # time.sleep(10)
                # train(request.user)
                return Response(serializer.data)
            # time.sleep(20)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            # time.sleep(20)
            return Response({"data":"No Data Found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            rating = Rating.objects.get(pk=pk)
            rating.delete()
            # train(request.user)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except:
            # time.sleep(20)
            return Response({"data":"No Data Found"}, status=status.HTTP_404_NOT_FOUND)
