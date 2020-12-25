import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { useSelector } from "react-redux";
import Movie from "./Movie";
import path from "../settings";

//axios Instance ????, Redirect ??????
/*Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
    at MovieDetail (https://6vvyr.csb.app/src/components/MovieDetail.jsx:34:50)*/

//How to update automatically if change observed in the other page like rating
function MoviesList() {
  const [movieList, setMovieList] = useState([]);
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    async function fetcher() {
      try {
        const url = path + "api/movies/list/";
        const method = "get";
        const form_data = new FormData();
        form_data.append("access", authState.access);
        form_data.append("refresh", authState.refresh);
        const config = { url, method, data: form_data };
        const res = await axiosInstance(config);
        setMovieList(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetcher();
  }, []);

  function listMovies(movie) {
    return (
      <div key={movie.id}>
        <Movie movie={movie} />
      </div>
    );
  }

  return (
    <div>
      <h1>This is Movies Page</h1>
      {movieList.map((movie) => listMovies(movie))}
    </div>
  );
}
export default MoviesList;
