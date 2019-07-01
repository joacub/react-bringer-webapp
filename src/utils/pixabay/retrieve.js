import omit from 'lodash.omit';
import request from 'superagent';
import q from 'q';
import url from 'url';

const searchString = search => search.map(term => encodeURIComponent(term)).join(' ');

const urlPromise = (query, urlStr, search) => {
  query.q = searchString(search);

  const urlObj = url.parse(urlStr);
  urlObj.query = query;

  return q(url.format(urlObj));
};

const retrieve = (search, options) => {
  const query = omit(options, 'url');
  return urlPromise(query, options.url, search).then(request.get.bind(request));
};

export default retrieve;
