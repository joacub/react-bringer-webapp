// import React from 'react';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
// import Redirect from 'react-router/Redirect';
import App from 'containers/App/App';
import Home from 'containers/Home/Loadable';
import NotFound from 'containers/NotFound/Loadable';
import Login from 'containers/Login/Loadable';
import LoginSuccess from 'containers/LoginSuccess/Loadable';
import Register from 'containers/Register/Loadable';

const isAuthenticated = connectedRouterRedirect({
  redirectPath: '/login',
  authenticatedSelector: state => !!state.auth.user,
  wrapperDisplayName: 'UserIsAuthenticated'
});

const isNotAuthenticated = connectedRouterRedirect({
  redirectPath: '/',
  authenticatedSelector: state => state.auth.user === null,
  wrapperDisplayName: 'UserIsNotAuthenticated',
  allowRedirectBack: false
});

// const redirect = () => <Redirect to="/en/" />;

const routes = [
  {
    component: App,
    routes: [
      // { path: '/', exact: true, component: redirect },
      { path: '/', exact: true, component: Home },
      { path: '/login/:type?/:slug?', component: Login, params: { noFooter: true } },
      { path: '/login-success', component: isAuthenticated(LoginSuccess) },
      { path: '/register', component: isNotAuthenticated(Register) },
      { component: NotFound, params: { is404: true } }
    ]
  }
];

export default routes;
