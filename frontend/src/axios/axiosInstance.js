import axios from "axios";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  authStart,
  authSuccess,
  authFailure,
  authTimeout
} from "../redux/auth/authActions";
import { store } from "../redux/store";
import path from "../settings";

export const axiosInstance = axios
  .create
  // {
  //   baseUrl:"http://localhost:8000/api",
  //   headers:{
  //     Authorization:`JWT ${useSelector(state=>state.auth.access)}`
  //   }
  // }
  ();

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `JWT ${config.data.get("access")}`
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export async function refreshTokens(refresh) {
  const url = path + "api/authentication/token/refresh/";
  const form_data = new FormData();
  const method = "post";
  form_data.append("refresh", refresh);
  const config = { url, method, data: form_data };
  const res = await axios(config);
  console.log(res.data);
  return res.data;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(`err : ${error}`);
    if (error.response.statusText === "Unauthorized") {
      const refresh = originalRequest.data.get("refresh");

      try {
        const res = await refreshTokens(refresh);
        originalRequest.data.set("access", res.access);
        originalRequest.data.set("refresh", res.refresh);
        const { dispatch } = store;
        dispatch(authSuccess(res));
        console.log("Success Done");
        return axiosInstance(originalRequest);
      } catch (err) {
        console.log("This is error");
        console.log(err);
      }
    }
    return Promise.reject(error);
  }
);
