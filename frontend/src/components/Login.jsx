import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authLogin } from "../redux/auth/authActions";

function Login() {
  const authState = useSelector((state) => state.auth);
  const [user, setUser] = useState({ username: "", password: "" });
  const dispatch = useDispatch();

  // useEffect(()=>{

  // })

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setUser({ ...user, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(authLogin(user.username, user.password, authState));
    setUser({ username: "", password: "" });
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
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}
export default Login;
