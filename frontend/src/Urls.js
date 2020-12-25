import React from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Update from "./components/Update";
import Layout from "./components/Layout";
import MoviesList from "./components/MoviesList";
import MovieDetail from "./components/MovieDetail";
import { useSelector } from "react-redux";
import UserDetail from "./components/UserDetail";

function Urls() {
  const authState = useSelector((state) => state.auth);
  console.log("Urls");

  function PrivateRoute({ children, ...rest }) {
    if (authState.refresh && authState.refresh !== "") {
      return <Route {...rest}>{children}</Route>;
    }

    return <Redirect to="/login/"></Redirect>;
  }

  function LoginRoute({ Children, ...rest }) {
    if (authState.refresh === "") {
      return <Route {...rest}></Route>;
    }

    return <Redirect to="/">{Children}</Redirect>;
  }

  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <PrivateRoute path="/" exact>
            <Home />
          </PrivateRoute>
          <PrivateRoute path="/movies/" exact>
            <MoviesList />
          </PrivateRoute>
          <PrivateRoute path="/movie_detail/:id" exact>
            <MovieDetail />
          </PrivateRoute>
          <LoginRoute path="/login/" exact>
            <Login />
          </LoginRoute>
          <LoginRoute path="/register/" exact>
            <Register />
          </LoginRoute>
          <PrivateRoute path="/update_password/" exact>
            <Update />
          </PrivateRoute>
          <PrivateRoute path="/userprofile/" exact>
            <UserDetail />
          </PrivateRoute>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}
export default Urls;
