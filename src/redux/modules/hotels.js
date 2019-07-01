import { FORM_ERROR } from 'final-form';

const CLEAR = 'redux-bringer/hotels/CLEAR';

const LOAD = 'redux-bringer/hotels/LOAD';
const LOAD_SUCCESS = 'redux-bringer/hotels/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-bringer/hotels/LOAD_FAIL';

const BOOKING = 'redux-bringer/hotels/BOOKING';
const BOOKING_SUCCESS = 'redux-bringer/hotels/BOOKING_SUCCESS';
const BOOKING_FAIL = 'redux-bringer/hotels/BOOKING_FAIL';

const initialState = {
  loaded: false,
  hotels: {},
  hotelsLoaded: {}
};

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

const storage = __SERVER__ ? null : require('localforage');

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CLEAR:
      return {
        ...state,
        loading: true,
        hotels: {}
      };
    case LOAD:
      return {
        ...state,
        id: null,
        error: null,
        loading: true
      };
    case LOAD_SUCCESS: {
      if (action.skip === 0) {
        state.hotels[action.key] = [];
      }
      const stoiresLoaded = state.hotels[action.key] || [];

      return {
        ...state,
        key: action.key,
        timeFetch: { ...state.timeFetch, [action.key]: new Date().getTime() },
        loading: false,
        loaded: { ...state.loaded, [action.key]: true },
        hasMore: Array.isArray(action.result) && action.result.length !== 0,
        hasMoreByKey: {
          ...state.hasMoreByKey,
          [action.key]: Array.isArray(action.result) && action.result.length !== 0
        },
        hotels: { ...state.hotels, [action.key]: stoiresLoaded.concat(action.result) }
      };
    }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: { ...state.loaded, [action.key]: false },
        key: action.key,
        id: action.id,
        error: action.error
      };

    default:
      return state;
  }
}

export function isLoaded(globalState, key) {
  return (
    globalState.hotels
    && globalState.hotels.loaded[key]
  );
}

export function load(params, key) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    key,
    skip: params.$skip,
    promise: async ({ app }, dispatch, getState) => {
      const store = getState();
      const fetch = () => app.service('hotels').find({
        query: params
      }).then(r => {
        if (storage) {
          storage.setItem(`load-hotels-${key}`, r);
        }
        return r;
      }).catch(async r => {
        if (storage && r.type === 'FeathersError' && r.name === 'Timeout' && r.code === 408) {
          const resultCached = await storage.getItem(`load-hotels-${key}`);
          if (resultCached) {
            return resultCached;
          }
        }
        throw r;
      });

      if (store.online.isOnline) {
        return fetch();
      } if (storage) {
        const resultCached = await storage.getItem(`load-hotels-${key}`);
        if (resultCached) {
          return resultCached;
        }
        return fetch();
      }
    }
  };
}

export function booking(data) {
  return {
    types: [BOOKING, BOOKING_SUCCESS, BOOKING_FAIL],
    promise: async ({ app }) => app
      .service('booking')
      .create(data)
      .catch(catchValidation)
  };
}

export function clear() {
  return {
    type: CLEAR
  };
}
