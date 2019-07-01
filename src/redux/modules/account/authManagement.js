import { FORM_ERROR } from 'final-form';

const CHANGE_PASSWORD_START = 'redux-bringer/account/settings/CHANGE_PASSWORD_START';
const CHANGE_PASSWORD_SUCCESS = 'redux-bringer/account/settings/CHANGE_PASSWORD_SUCCESS';
const CHANGE_PASSWORD_FAIL = 'redux-bringer/account/settings/CHANGE_PASSWORD_FAIL';

const CHANGE_IDENTITY_START = 'redux-bringer/account/settings/CHANGE_IDENTITY_START';
const CHANGE_IDENTITY_SUCCESS = 'redux-bringer/account/settings/CHANGE_IDENTITY_SUCCESS';
const CHANGE_IDENTITY_FAIL = 'redux-bringer/account/settings/CHANGE_IDENTITY_FAIL';

const VERIFY_SIGN_UP_START = 'redux-bringer/account/settings/VERIFY_SIGN_UP_START';
const VERIFY_SIGN_UP_SUCCESS = 'redux-bringer/account/settings/VERIFY_SIGN_UP_SUCCESS';
const VERIFY_SIGN_UP_FAIL = 'redux-bringer/account/settings/VERIFY_SIGN_UP_FAIL';

const VERIFY_CHANGES_START = 'redux-bringer/account/settings/VERIFY_CHANGES_START';
const VERIFY_CHANGES_SUCCESS = 'redux-bringer/account/settings/VERIFY_CHANGES_SUCCESS';
const VERIFY_CHANGES_FAIL = 'redux-bringer/account/settings/VERIFY_CHANGES_FAIL';

const RESEND_VERIFY_SIGNUP_START = 'redux-bringer/account/settings/RESEND_VERIFY_SIGNUP_START';
const RESEND_VERIFY_SIGNUP_SUCCESS = 'redux-bringer/account/settings/RESEND_VERIFY_SIGNUP_SUCCESS';
const RESEND_VERIFY_SIGNUP_FAIL = 'redux-bringer/account/settings/RESEND_VERIFY_SIGNUP_FAIL';

const SEND_RESET_PWD_START = 'redux-bringer/account/settings/SEND_RESET_PWD_START';
const SEND_RESET_PWD_SUCCESS = 'redux-bringer/account/settings/SEND_RESET_PWD_SUCCESS';
const SEND_RESET_PWD_FAIL = 'redux-bringer/account/settings/SEND_RESET_PWD_FAIL';

const RESET_PWD_LONG_START = 'redux-bringer/account/settings/RESET_PWD_LONG_START';
const RESET_PWD_LONG_SUCCESS = 'redux-bringer/account/settings/RESET_PWD_LONG_SUCCESS';
const RESET_PWD_LONG_FAIL = 'redux-bringer/account/settings/RESET_PWD_LONG_FAIL';

const CLEAR_STATE = 'redux-bringer/account/settings/CLEAR_STATE';

const initialState = {
  loading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHANGE_PASSWORD_START:
      return {
        ...state,
        loading: true
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordResult: action.result,
        loading: false
      };
    case CHANGE_PASSWORD_FAIL:
      return {
        ...state,
        changePasswordResultError: action.error,
        loading: false
      };

    case CHANGE_IDENTITY_START:
      return {
        ...state,
        loading: true
      };
    case CHANGE_IDENTITY_SUCCESS:
      return {
        ...state,
        changeIdentityResult: action.result,
        loading: false
      };
    case CHANGE_IDENTITY_FAIL:
      return {
        ...state,
        changeIdentityResultError: action.error,
        loading: false
      };

    case VERIFY_SIGN_UP_START:
      return {
        ...state,
        loading: true
      };
    case VERIFY_SIGN_UP_SUCCESS:
      return {
        ...state,
        verifySignUpResult: action.result,
        verifySignUpResultError: null,
        loading: false
      };
    case VERIFY_SIGN_UP_FAIL:
      return {
        ...state,
        verifySignUpResultError: action.error,
        loading: false
      };

    case VERIFY_CHANGES_START:
      return {
        ...state,
        loading: true
      };
    case VERIFY_CHANGES_SUCCESS:
      return {
        ...state,
        verifyChangesResult: action.result,
        verifyChangesResultError: null,
        loading: false
      };
    case VERIFY_CHANGES_FAIL:
      return {
        ...state,
        verifyChangesResultError: action.error,
        loading: false
      };

    case RESEND_VERIFY_SIGNUP_START:
      return {
        ...state,
        loading: true
      };
    case RESEND_VERIFY_SIGNUP_SUCCESS:
      return {
        ...state,
        resendVerifySignupResult: action.result,
        resendVerifySignupResultError: null,
        loading: false
      };
    case RESEND_VERIFY_SIGNUP_FAIL:
      return {
        ...state,
        resendVerifySignupResultError: action.error,
        loading: false
      };
    case SEND_RESET_PWD_START:
      return {
        ...state,
        loading: true
      };
    case SEND_RESET_PWD_SUCCESS:
      return {
        ...state,
        sendResetPwdResult: action.result,
        sendResetPwdResultError: null,
        loading: false
      };
    case SEND_RESET_PWD_FAIL:
      return {
        ...state,
        sendResetPwdResultError: action.error,
        loading: false
      };

    case RESET_PWD_LONG_START:
      return {
        ...state,
        loading: true
      };
    case RESET_PWD_LONG_SUCCESS:
      return {
        ...state,
        resetPwdLongResult: action.result,
        resetPwdLongResultError: null,
        loading: false
      };
    case RESET_PWD_LONG_FAIL:
      return {
        ...state,
        resetPwdLongResultError: action.error,
        loading: false
      };
    case CLEAR_STATE:
      return {
        ...state,
        sendResetPwdResultError: null,
        sendResetPwdResult: null,
        loading: false
      };

    default:
      return state;
  }
}

const catchValidation = error => {
  if (error.message) {
    if (error.message === 'Validation failed' && error.data) {
      return Promise.reject(error.data);
    }
    const err = {
      [FORM_ERROR]: error.message
    };
    return Promise.reject(err);
  }
  return Promise.reject(error);
};

export function verifySignUp(slug) {
  return {
    types: [VERIFY_SIGN_UP_START, VERIFY_SIGN_UP_SUCCESS, VERIFY_SIGN_UP_FAIL],
    promise: async ({ app }) => app.service('authManagement').create({
      action: 'verifySignupLong',
      value: slug
    })
  };
}

export function verifyChanges(slug) {
  return {
    types: [VERIFY_CHANGES_START, VERIFY_CHANGES_SUCCESS, VERIFY_CHANGES_FAIL],
    promise: async ({ app }) => app.service('authManagement').create({
      action: 'verifySignupLong',
      value: slug
    })
  };
}

export function passwordChange(email, oldPassword, password) {
  return {
    types: [CHANGE_PASSWORD_START, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL],
    promise: async ({ app }) => app.service('authManagement').create({
      action: 'passwordChange',
      value: {
        user: {
          email
        },
        oldPassword,
        password
      }
    })
  };
}

export function identityChange(email, password, changes) {
  return {
    types: [CHANGE_IDENTITY_START, CHANGE_IDENTITY_SUCCESS, CHANGE_IDENTITY_FAIL],
    promise: async ({ app }) => app
      .service('authManagement')
      .create({
        action: 'identityChange',
        value: {
          user: {
            email
          },
          password,
          changes
        }
      })
      .catch(catchValidation)
  };
}

export function resendVerifySignup(email) {
  return {
    types: [CHANGE_IDENTITY_START, CHANGE_IDENTITY_SUCCESS, CHANGE_IDENTITY_FAIL],
    promise: async ({ app }) => app
      .service('authManagement')
      .create({
        action: 'resendVerifySignup',
        value: {
          email
        }
      })
      .catch(catchValidation)
  };
}

export function sendResetPwd(email) {
  return {
    types: [SEND_RESET_PWD_START, SEND_RESET_PWD_SUCCESS, SEND_RESET_PWD_FAIL],
    promise: async ({ app }) => app
      .service('authManagement')
      .create({
        action: 'sendResetPwd',
        value: {
          email
        }
      })
      .catch(catchValidation)
  };
}

export function resetPwdLong(token, password) {
  return {
    types: [RESET_PWD_LONG_START, RESET_PWD_LONG_SUCCESS, RESET_PWD_LONG_FAIL],
    promise: async ({ app }) => app
      .service('authManagement')
      .create({
        action: 'resetPwdLong',
        value: { token, password }
      })
      .catch(catchValidation)
  };
}

export function clearState() {
  return {
    type: CLEAR_STATE
  };
}
