import React from 'react';
import provideHooks from 'redial/lib/provideHooks';
import reducerAuthManagement, { verifySignUp, verifyChanges } from 'redux/modules/account/authManagement';
import loadable from '@loadable/component';

const Login = loadable(() => import(/* webpackChunkName: 'login' */ './Login'));

@provideHooks({
  fetch: async ({
    params, store: {
      dispatch, inject, asyncReducers, getState
    }
  }) => {
    const promises = [];

    if (!asyncReducers.authManagement) {
      inject({ authManagement: reducerAuthManagement });
    }

    const state = getState();

    switch (params.type) {
      case 'verify':
        if (params.slug && !state.authManagement.verifySignUpResult && !state.authManagement.verifySignUpResultError) {
          promises.push(dispatch(verifySignUp(params.slug)).catch(() => null));
        }
        break;
      case 'verifyChanges':
        if (params.slug
          && !state.authManagement.verifyChangesResult
          && !state.authManagement.verifyChangesResultError) {
          promises.push(dispatch(verifyChanges(params.slug)).catch(() => null));
        }
        break;
      default:
        break;
    }
    await Promise.all(promises);
  },
  defer: async ({
    store: {
      inject, asyncReducers
    }
  }) => {
    if (!asyncReducers.authManagement) {
      inject({ authManagement: reducerAuthManagement });
    }
  }
})
export default class LoginContainer extends React.Component {
  render() {
    return <Login {...this.props} />;
  }
}
