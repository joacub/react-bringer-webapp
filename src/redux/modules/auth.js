import { FORM_ERROR } from 'final-form';
import { setCookie, setUser, setToken } from 'utils/auth/helpers';
import cookie from 'js-cookie';

const LOAD = 'redux-bringer/auth/LOAD';
const LOAD_SUCCESS = 'redux-bringer/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-bringer/auth/LOAD_FAIL';
const LOGIN = 'redux-bringer/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-bringer/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'redux-bringer/auth/LOGIN_FAIL';
const REGISTER = 'redux-bringer/auth/REGISTER';
const REGISTER_SUCCESS = 'redux-bringer/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'redux-bringer/auth/REGISTER_FAIL';
const LOGOUT = 'redux-bringer/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-bringer/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-bringer/auth/LOGOUT_FAIL';

const initialState = {
  loaded: false,
  user: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        error: false
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        accessToken: action.result.accessToken,
        user: action.result.user,
        error: false
      };
    case LOAD_FAIL: {
      let failParams = {};
      if (action.error
        && (action.error.message === 'invalid signature'
        || action.error.name === 'NotAuthenticated')
      ) {
        failParams = {
          loaded: true,
          user: false,
          accessToken: false,
        };
      }
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error,
        ...failParams
      };
    }
    case LOGIN:
      return {
        ...state,
        loggingIn: true,
        error: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loaded: true,
        accessToken: action.result.accessToken,
        user: action.result.user,
        error: false,
        loginError: false,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };
    case REGISTER:
      return {
        ...state,
        registeringIn: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registeringIn: false
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registeringIn: false,
        registerError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true,
        logoutError: false
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        accessToken: null,
        user: null,
        logoutError: false,
        error: false,
        loginError: false
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const catchValidation = error => {
  if (error.message) {
    if (error.message === 'Validation failed' && error.data) {
      const errorMsg = Object.keys(error.data).map(key => `${capitalize(key)}: ${error.data[key]} \n`);
      const err = {
        [FORM_ERROR]: errorMsg
      };
      return Promise.reject(err);
    }
    const err = {
      [FORM_ERROR]: error.message
    };
    return Promise.reject(err);
  }
  return Promise.reject(error);
};

/*
 * Actions
 * * * * */

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function load(force = false) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: async ({ app, restApp, client }) => {
      const response = force ? await app.authentication.reAuthenticate(true) : await app.authenticate();
      await setCookie({ app })(response);
      setToken({ client, app, restApp })(response);
      setUser({ app, restApp })(response);
      return response;
    }
  };
}

export function register(data) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: ({ app }) => app
      .service('users')
      .create(data)
      .catch(catchValidation)
  };
}

export function login(strategy, data) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: async ({ client, restApp, app }) => {
      try {
        const response = await app.authenticate({
          ...data,
          strategy
        });
        await setCookie({ app })(response);
        setToken({ client, app, restApp })(response);
        setUser({ app, restApp })(response);
        return response;
      } catch (error) {
        if (strategy === 'local') {
          return catchValidation(error);
        }
        throw error;
      }
    }
  };
}

export function logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: async ({ client, app, restApp }) => {
      try {
        await app.logout();
        setToken({ client, app, restApp })({ accessToken: null });
        cookie.remove('feathers-jwt');
      } catch (e) {
        if (e.error === 'NotAuthenticated') {
          setToken({ client, app, restApp })({ accessToken: null });
          cookie.remove('feathers-jwt');
        }
      }
    }
  };
}
