//import {authStart, authSuccess, authLogout, authFailure} from "./authActions"
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  AUTH_LOGOUT
} from "./authActionTypes";

const initialState = {
  loading: false,
  access: "",
  refresh: "",
  error: ""
};

function authStartReducer(state, action) {
  return {
    ...state,
    loading: true
  };
}

function authSuccessReducer(state, action) {
  localStorage.setItem("access", action.payload.access);
  localStorage.setItem("refresh", action.payload.refresh);

  console.log("Success Got Called");
  return {
    ...state,
    loading: false,
    access: action.payload.access,
    refresh: action.payload.refresh,
    error: ""
  };
}

function authFailureReducer(state, action) {
  return {
    ...state,
    loading: false,
    error: action.error
  };
}

function authLogoutReducer(state, action) {
  console.log("Logout Got Called");
  return {
    ...state,
    access: "",
    refresh: ""
  };
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_START:
      return authStartReducer(state, action);

    case AUTH_SUCCESS:
      return authSuccessReducer(state, action);

    case AUTH_FAILURE:
      return authFailureReducer(state, action);

    case AUTH_LOGOUT:
      return authLogoutReducer(state, action);

    default:
      return state;
  }
}
