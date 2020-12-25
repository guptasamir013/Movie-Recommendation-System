import React, { useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../axios/axiosInstance";
import path from "../settings";

function Update() {
  const [user, setUser] = useState({ password1: "", password2: "" });
  const authState = useSelector((state) => state.auth);
  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUser({ ...user, [name]: value });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const method = "post";
    const url = path + "api/authentication/update_password/";
    const form_data = new FormData();
    form_data.append("password1", user.password1);
    form_data.append("password2", user.password2);
    form_data.append("access", authState.access);
    form_data.append("refresh", authState.refresh);

    const config = { method, url, data: form_data };
    try {
      const res = await axiosInstance(config);
    } catch (err) {
      console.log(err);
    }
    setUser({ password1: "", password2: "" });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Password1</label>
        <input
          type="text"
          name="password1"
          value={user.password1}
          onChange={handleChange}
        />
        <br />
        <label>Password2</label>
        <input
          type="password"
          name="password2"
          value={user.password2}
          onChange={handleChange}
        />
        <br />
        <button>Update</button>
      </form>
    </div>
  );
}
export default Update;
