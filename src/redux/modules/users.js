const CLEAR = 'redux-bringer/users/CLEAR';

const LOAD = 'redux-bringer/users/LOAD';
const LOAD_SUCCESS = 'redux-bringer/users/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-bringer/users/LOAD_FAIL';

const SAVE = 'redux-bringer/users/SAVE';
const SAVE_SUCCESS = 'redux-bringer/users/SAVE_SUCCESS';
const SAVE_FAIL = 'redux-bringer/users/SAVE_FAIL';

const initialState = {
  loaded: false,
  result: {},
  usersLoaded: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLEAR:
      return {
        ...state,
        loading: true,
        result: {}
      };
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        result: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };

    case SAVE:
      return {
        ...state,
        loading: true
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        resultSave: action.result
      };
    case SAVE_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };

    default:
      return state;
  }
}

export function find(user) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: ({ app }) => app.service('users').find({
      query: {
        username: {
          $like: `%${user}%`
        },
        $limit: 10
      }
    })
  };
}


export function save(data) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    promise: ({ app }) => app.service('users').patch(data.uid, data)
  };
}

export function clear() {
  return {
    type: CLEAR
  };
}
