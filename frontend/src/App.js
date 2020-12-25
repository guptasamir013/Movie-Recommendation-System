import React, { useState, useEffect } from "react";
import "./styles.css";
import Urls from "./Urls";
import { authStart, authSuccess, stateUpdate } from "./redux/auth/authActions";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import path from "./settings";

export default function App() {
  const [check, setCheck] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetcher(refresh) {
      try {
        const url = path + "api/authentication/token/refresh/";
        const form_data = new FormData();
        const method = "post";
        form_data.append("refresh", refresh);
        const config = { url, method, data: form_data };
        const res = await axios(config);
        dispatch(authSuccess(res.data));
      } catch (err) {
        console.log(err);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
      setCheck(true);
    }

    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      fetcher(refresh);
    } else {
      setCheck(true);
    }
  }, []);

  return <div className="App">{check && <Urls></Urls>}</div>;
}
