import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../axios/axiosInstance";
import path from "../settings";

function UserDetail() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    image: ""
  });
  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    async function fetcher() {
      try {
        const url = path + "api/authentication/userprofile/";
        const method = "get";
        const form_data = new FormData();
        form_data.append("access", authState.access);
        form_data.append("refresh", authState.refresh);

        const config = { url, method, data: form_data };
        const res = await axiosInstance(config);
        console.log(res);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetcher();
  }, []);
  return (
    <div>
      {user.username !== "" && (
        <div>
          <h1>username : {user.username} </h1>
          <h3>email : {user.email}</h3>
          <img
            src={`${path.slice(0, -1)}${user.image}`}
            alt={user.username}
            height="150px"
          />
        </div>
      )}
    </div>
  );
}
export default UserDetail;
