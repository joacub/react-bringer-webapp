import isOnline from 'utils/isOnline';

const LOAD = 'redux-bringer/online/LOAD';
const LOAD_SUCCESS = 'redux-bringer/online/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-bringer/online/LOAD_FAIL';

const initialState = {
  isOnline: true,
  loading: false,
  error: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD: {
      return {
        ...state,
        loading: true
      };
    }
    case LOAD_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: false,
        isOnline: action.result
      };
    }
    case LOAD_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.error
      };
    }
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: () => new Promise(resolve => {
      setTimeout(async () => {
        resolve(await isOnline());
      }, 500);
    })
  };
}
