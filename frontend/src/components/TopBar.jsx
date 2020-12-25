import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { authLogout } from "../redux/auth/authActions";

function TopBar() {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.auth);
  return (
    <div>
      <nav>
        {access !== "" && (
          <Link to="/">
            <button>Home</button>
          </Link>
        )}
        {access !== "" && (
          <Link to="/movies/">
            <button>Movies</button>
          </Link>
        )}
        <Link to="/register/">
          <button>Register</button>
        </Link>

        {access !== "" && (
          <Link to="/update_password/">
            <button>Update</button>
          </Link>
        )}
        {access !== "" && (
          <Link to="/userprofile/">
            <button>User Profile</button>
          </Link>
        )}
        {access !== "" ? (
          <button onClick={(event) => dispatch(authLogout(access, refresh))}>
            Logout
          </button>
        ) : (
          <Link to="/login/">
            <button>Login</button>
          </Link>
        )}
        <hr />
      </nav>
    </div>
  );
}
export default TopBar;
