import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../axios/axiosInstance";
import { authLogin } from "../redux/auth/authActions";
import path from "../settings";

function Register() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    image: null
  });

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // console.log(authState);

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUser({ ...user, [name]: value });
  }
  function handleImageChange(event) {
    setUser({ ...user, image: event.target.files[0] });
  }

  //setting image to null?????????????
  async function handleSubmit(event) {
    event.preventDefault();

    const method = "post";
    const url = path + "api/authentication/register/";
    console.log(url);
    const form_data = new FormData();
    form_data.append("username", user.username);
    form_data.append("password", user.password);
    form_data.append("email", user.email);
    form_data.append("image", user.image);
    form_data.append("access", authState.access);
    form_data.append("refresh", authState.refresh);

    const config = { method, url, data: form_data };

    try {
      const res = await axiosInstance(config);
      console.log(res.data);
      dispatch(authLogin(user.username, user.password, authState));
    } catch (err) {
      console.log(err);
    }
    // console.log(res.data);
    setUser({ username: "", password: "", email: "", image: null });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleChange}
        />
        <br />
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
        <br />
        <label>Image</label>
        <input type="file" name="image" onChange={handleImageChange} />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}
export default Register;
