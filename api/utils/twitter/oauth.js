import config from 'config';
import OAuth from 'oauth';

const oauth = new OAuth.OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  config.authentication.oauth.twitter.key,
  config.authentication.oauth.twitter.secret,
  '1.0A',
  `${config.domain}/login`,
  'HMAC-SHA1'
);

export default oauth;
