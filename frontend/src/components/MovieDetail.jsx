import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../axios/axiosInstance";
import Movie from "./Movie";
import path from "../settings";

function MovieDetail(props) {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [initialRating, setInitialRating] = useState(null);
  const [rating, setRating] = useState(0);
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    async function fetcher1() {
      try {
        const url = `${path}api/movies/detail/${id}/`;
        const method = "get";
        const form_data = new FormData();
        form_data.append("access", authState.access);
        form_data.append("refresh", authState.refresh);

        const config = { url, method, data: form_data };
        const res = await axiosInstance(config);
        setMovie(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetcher1();
    async function fetcher2() {
      try {
        const url = `${path}api/movies/rating_list/${id}/`;
        const method = "get";
        const form_data = new FormData();
        form_data.append("access", authState.access);
        form_data.append("refresh", authState.refresh);

        const config = { url, method, data: form_data };
        const res = await axiosInstance(config);
        setInitialRating(res.data);
        setRating(res.data.value);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetcher2();
  }, []);

  function handleRatingChange(event) {
    setRating(event.target.value);
  }

  async function handleRatingSubmit() {
    try {
      if (initialRating) {
        console.log("Hi");
        const url = `${path}api/movies/rating_detail/${initialRating.id}/`;
        const method = "put";
        const form_data = new FormData();
        form_data.append("access", authState.access);
        form_data.append("refresh", authState.refresh);
        form_data.append("value", rating);
        const config = { url, method, data: form_data };
        const res = await axiosInstance(config);
        console.log(res.data);
      } else {
        console.log("Hello");
        const url = `${path}api/movies/rating_list/${id}/`;
        const method = "post";
        const form_data = new FormData();
        form_data.append("access", authState.access);
        form_data.append("refresh", authState.refresh);
        form_data.append("value", rating);
        const config = { url, method, data: form_data };
        const res = await axiosInstance(config);
        setInitialRating(res.data);
        console.log(res.data);
      }
    } catch (err) {
      console.log("HiHello");
      console.log(err);
    }
  }

  async function handleRatingDelete() {
    try {
      const url = `${path}api/movies/rating_detail/${initialRating.id}/`;
      const method = "delete";
      const form_data = new FormData();
      form_data.append("access", authState.access);
      form_data.append("refresh", authState.refresh);
      const config = { url, method, data: form_data };
      const res = await axiosInstance(config);
      setRating(0);
      setInitialRating(null);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {movie != null && <Movie movie={movie} />}

      <label>Rating:</label>
      <input type="number" value={rating} onChange={handleRatingChange} />
      <button onClick={handleRatingSubmit}>Rate</button>
      <button onClick={handleRatingDelete}>Delete</button>
    </div>
  );
}

export default MovieDetail;
