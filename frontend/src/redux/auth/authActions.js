import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT
} from "./authActionTypes";
import { axiosInstance, refreshTokens } from "../../axios/axiosInstance";
import axios from "axios";
import { useStore } from "react-redux";

import path from "../../settings";

export let timeoutID = null;

export function authStart() {
  return {
    type: AUTH_START
  };
}

export function authSuccess(tokens) {
  return {
    type: AUTH_SUCCESS,
    payload: tokens
  };
}

export function authFailure(error) {
  return {
    type: AUTH_FAILURE,
    error: error
  };
}

export function authLogoutAsync() {
  // async function logout(access, refresh) {
  //   const method = "post";
  //   const url = "http://localhost:8000/api/authentication/token/blacklist/";
  //   let form_data = new FormData();
  //   form_data.append("refresh", refresh);
  //   form_data.append("access", access);

  //   const config = { method, url, data: form_data };

  //   console.log("Logout Request Sent");

  //   const res = await axiosInstance(config);

  //   console.log("Logout Request Done");

  //   localStorage.removeItem("access");
  //   localStorage.removeItem("refresh");
  // }
  // console.log("logout function called");
  // logout(access, refresh);
  // console.log("logout function done");

  return {
    type: AUTH_LOGOUT
  };
}

export function authLogout(access, refresh) {
  return async (dispatch) => {
    const method = "post";
    const url = path + "api/authentication/token/blacklist/";
    let form_data = new FormData();
    form_data.append("refresh", refresh);
    form_data.append("access", access);

    const config = { method, url, data: form_data };

    console.log("Logout Request Sent");

    const res = await axiosInstance(config);
    dispatch(authLogoutAsync());

    console.log("Logout Request Done");

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };
}

export function authTimeout(access, refresh) {
  return (dispatch) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      dispatch(authLogout(access, refresh));
    }, 5 * 1000 * 1000);
  };
}

export function authLogin(username, password, authState) {
  return async (dispatch) => {
    dispatch(authStart());
    try {
      // const headers = {
      //   Authorization: `JWT ${authState.access}`
      // };
      const method = "post";
      const url = path + "api/authentication/token/obtain/";
      let form_data = new FormData();
      form_data.append("username", username);
      form_data.append("password", password);
      form_data.append("access", authState.access);
      form_data.append("refresh", authState.refresh);

      const config = { method, url, data: form_data };
      const res = await axiosInstance(config);

      console.log(res);

      dispatch(authSuccess(res.data));
      //dispatch(authTimeout(res.data.access, res.data.refresh));
    } catch (err) {
      dispatch(authFailure(err));
    }
  };
}

export function stateUpdate() {
  return (dispatch) => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    if (refresh) {
      try {
        // const res = await refreshTokens(refresh);
        // const url = "http://localhost:8000/api/authentication/token/refresh/";
        // const form_data = new FormData();
        // const method = "post";
        // form_data.append("refresh", refresh);
        // const config = { url, method, data: form_data };
        // const res = await axios(config);
        const res = { access, refresh };
        console.log("Hello");
        dispatch(authSuccess(res));
      } catch (err) {
        console.log(err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }
  };
}
