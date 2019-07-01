/* eslint-disable  no-case-declarations */
const LOAD = 'redux-mytradewallet/settings/LOAD';
const LOAD_FAIL = 'redux-mytradewallet/settings/LOAD_FAIL';
const LOAD_SUCCESS = 'redux-mytradewallet/settings/LOAD_SUCCESS';
const CHANGE_THEME = 'redux-mytradewallet/settings/CHANGE_THEME';

const initialState = {
  theme: 'light',
  uiTheme: {
    direction: 'ltr',
    paletteType: 'light'
  },
  lang: 'en',
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        ...action.result,
        loading: false,
        loaded: true
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case CHANGE_THEME:
      const { uiTheme } = action;
      const result = {
        ...state,
        uiTheme
      };
      return result;

    default:
      return state;
  }
}

export function changeTheme(uiTheme) {
  return {
    type: CHANGE_THEME,
    uiTheme
  };
}
