import assign from 'lodash.assign';
import path from 'path';
import url from 'url';

import ResultList from './result-list';

const requiredDefaults = {
  page: 1,
  per_page: 20,
  url: 'https://pixabay.com/api'
};

const pixabayjs = {
  _auth: {},

  _makeConfig(endpoint, opts) {
    const conf = assign({}, requiredDefaults, this.defaults, this._auth, opts);
    const urlObj = url.parse(conf.url);

    urlObj.pathname = path.join(urlObj.pathname, endpoint, '/');
    conf.url = url.format(urlObj);

    return conf;
  },

  defaults: {},

  authenticate(key) {
    this._auth.key = key;
  },

  imageResultList(search, opts, onSuccess, onFailure) {
    const conf = this._makeConfig('', opts);
    return new ResultList(search, conf, onSuccess, onFailure);
  },

  videoResultList(search, opts, onSuccess, onFailure) {
    const conf = this._makeConfig('videos', opts);
    return new ResultList(search, conf, onSuccess, onFailure);
  }
};

export default pixabayjs;
