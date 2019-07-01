import React from 'react';
import provideHooks from 'redial/lib/provideHooks';
import { withRouter } from 'react-router';
import loadable from '@loadable/component';
import { find as findTags } from 'redux/modules/tags';
import { search as searchPub, isLoadedSearch } from 'redux/modules/publications';
import { isLoaded as isStoriesLoaded, load as loadStories } from 'redux/modules/stories';

const Search = loadable(() => import(/* webpackChunkName: 'search' */ './Search'));
@withRouter
@provideHooks({
  fetch: async ({ params, store: { dispatch, getState }, location }) => {
    const keyword = location.search.replace('?q=', '').replace(/%20/g, ' ');
    const state = getState();
    const promises = [];

    const { tag } = params;
    const paramsSearch = {
      status: 'public',
      $skip: 0,
      $limit: 10,
      $paginate: false,
      search: keyword
    };

    const paramsSearchPub = {
      $skip: 0,
      $limit: 10,
      $paginate: false,
      name: {
        $like: `%${keyword}%`
      },
    };
    const key = JSON.stringify(paramsSearch);
    if (!isStoriesLoaded(state, key)) {
      if (!__CLIENT__) {
        promises.push(dispatch(loadStories(paramsSearch, key)).catch(() => null));
      } else {
        dispatch(loadStories(paramsSearch, key)).catch(() => null);
      }
    }

    if (!isLoadedSearch(state, keyword)) {
      if (!__CLIENT__) {
        promises.push(dispatch(searchPub(paramsSearchPub, keyword)).catch(() => null));
      } else {
        dispatch(searchPub(paramsSearchPub, keyword)).catch(() => null);
      }
    }

    // if (!isStoriesLoaded(state, key)) {
    if (!__CLIENT__) {
      promises.push(dispatch(findTags(keyword)).catch(() => null));
    } else {
      dispatch(findTags(keyword)).catch(() => null);
    }
    // }

    await Promise.all(promises);
  }
})
export default class SearchContainer extends React.Component {
  render() {
    return <Search {...this.props} />;
  }
}
