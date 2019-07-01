import React from 'react';
import provideHooks from 'redial/lib/provideHooks';
import {
  isLoaded as isHotelsLoaded,
  load as getHotels,
} from 'redux/modules/hotels';
import loadable from '@loadable/component';

const Home = loadable(() => import(/* webpackChunkName: 'home' */ './Home'));

const paramsSearch = {
  $skip: 0,
  $limit: 20,
  $paginate: false,
  $sort: {
    price: 1
  }
};

const key = JSON.stringify(paramsSearch);
@provideHooks({
  fetch: async ({ store: { dispatch, getState } }) => {
    const state = getState();
    const promises = [];

    paramsSearch.$skip = 0;
    if (!__CLIENT__) {
      if (!isHotelsLoaded(state, key)) {
        promises.push(dispatch(getHotels(paramsSearch, key)).catch(() => null));
      }
    } else if (!isHotelsLoaded(state, key)) {
      dispatch(getHotels(paramsSearch, key)).catch(() => null);
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
  },
})
export default class HomeContainer extends React.Component {
  render() {
    return <Home {...this.props} />;
  }
}
