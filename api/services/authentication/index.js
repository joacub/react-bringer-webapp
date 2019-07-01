import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { NotAuthenticated } from '@feathersjs/errors';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth, OAuthStrategy } from '@feathersjs/authentication-oauth';
import session from 'express-session';
import connectRedis from 'connect-redis';

const request = require('request-compose').extend({
  Request: { oauth: require('request-oauth') }
}).client;

const RedisStore = connectRedis(session);

class MyAuthenticationService extends AuthenticationService {
  async create(data, params) {
    const authResult = await super.create(data, params);
    if (authResult && authResult.authentication) {
      if (!authResult.authentication.payload) {
        authResult.authentication.payload = await this.verifyAccessToken(authResult.accessToken);
      }
    }

    if (authResult && authResult.user) {
      const entity = authResult.user;
      if (!entity.isEnabled) {
        throw new NotAuthenticated();
      }
    }
    return authResult;
  }
}
class MyOAuthStrategy extends OAuthStrategy {
  authenticate(authentication, params) {
    this.currentAuth = authentication;
    const result = super.authenticate(authentication, params);
    if (result && result.user) {
      const entity = result.user;
      if (!entity.isEnabled) {
        throw new NotAuthenticated();
      }
    }
    return result;
  }

  async getEntityData(profile) {
    // Include the `email` from the GitHub profile when creating
    // or updating a user that logged in with GitHub
    const baseData = await super.getEntityData(profile);

    if (this.name === 'facebook') {
      const options = {
        headers: {
          authorization: `Bearer ${this.currentAuth.access_token}`
        },
        url: 'https://graph.facebook.com/me?fields=id,name,about,birthday,email,first_name,gender,link,last_name,languages,hometown,location,picture,address,installed,interested_in,install_type,short_name'
      };
      options.headers.authorization = `Bearer ${this.currentAuth.access_token}`;
      const response = await request(options)
        .then(({ body }) => body);
      profile = { ...response, ...profile };
    }

    return {
      [this.name]: profile,
      ...baseData,
    };
  }
}

class JWTStrategyOwn extends JWTStrategy {
  async authenticate(authentication, params) {
    const result = await super.authenticate(authentication, params);
    if (result && result.user) {
      const entity = result.user;
      if (!entity.isEnabled) {
        throw new NotAuthenticated();
      }
      const { payload } = result.authentication;
      const invalidTokensBeforeAtTime = new Date(entity.invalidTokensBeforeAt).getTime() / 1000;
      const iatInt = parseInt(payload.iat, 10);

      if (invalidTokensBeforeAtTime > iatInt) {
        throw new NotAuthenticated();
      }
    }

    return result;
  }
}

export default app => {
  // const config = app.get('config').auth;

  const authentication = new MyAuthenticationService(app);
  authentication.register('jwt', new JWTStrategyOwn());
  authentication.register('local', new LocalStrategy());
  authentication.register('twitter', new MyOAuthStrategy());
  authentication.register('facebook', new MyOAuthStrategy());
  app.use('/authentication', authentication);
  app.configure(expressOauth({
    expressSession: (req, res, next) => session({
      store: new RedisStore({ client: req.redisdb }),
      secret: 'Bringer--secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }
    })(req, res, next)
  }));
};
