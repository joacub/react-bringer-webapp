import isBot from 'isbot';
import IsMobile from 'utils/isMobile';
import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import socketio from '@feathersjs/socketio-client';
import { defaults, hooks } from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import axios from 'axios';
import commons from '@feathersjs/commons';
import config from './config';


const authenticationHook = () => context => {
  const {
    app, params, path, method, app: { authentication: service }
  } = context;
  if (commons.stripSlashes(service.options.path) === path && method === 'create') {
    return context;
  }

  return Promise.resolve(app.get('authentication')).then(authResult => {
    if (authResult) {
      context.params = Object.assign({}, authResult, params);
    }
    return context;
  }).catch(() => null);
};

const myauthentication = (_options = {}) => {
  const options = Object.assign({}, defaults, _options);
  const { Authentication } = options;
  return app => {
    const authentication = new Authentication(app, options);
    app.authentication = authentication;
    app.authenticate = authentication.authenticate.bind(authentication);
    app.reAuthenticate = authentication.reAuthenticate.bind(authentication);
    app.logout = authentication.logout.bind(authentication);
    app.hooks({
      before: {
        all: [
          authenticationHook(),
          hooks.populateHeader()
        ]
      }
    });
  };
};

// const storage = __SERVER__ ? null : require('localforage');

const host = clientUrl => (__SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : clientUrl);

const configureApp = transport => feathers()
  .configure(transport)
  .configure(myauthentication());

export const socket = io('', {
  path: host('/ws'),
  autoConnect: false,
  transports: ['websocket'],
  upgrade: false
});
export function createApp(req) {
  if (req === 'rest') {
    return configureApp(rest(host('/api')).axios(axios));
  }
  if (__SERVER__ && req) {
    const ip = req.header('x-forwarded-for') || req.header('x-real-ip') || req.ip;
    const accessToken = req.header('authorization') || (req.cookies && req.cookies['feathers-jwt']) || '';
    const app = configureApp(
      rest(host('/api')).axios(
        axios.create({
          headers: {
            Cookie: req.get('cookie') || '',
            Authorization: accessToken,
            'x-real-ip': ip,
            'x-forwarded-for': ip,
            'user-agent': req.get('user-agent') || ''
          }
        })
      )
    );

    if (accessToken) {
      app.authentication.setAccessToken(accessToken);
      app.set('accessToken', accessToken);
      app.authenticate().catch(() => null);
    } else {
      app.authentication.removeAccessToken(accessToken);
      app.set('accessToken', null);
    }

    app.req = req;

    const ua = req.get('user-agent');
    app.isSpider = isBot(ua);
    app.isMobile = new IsMobile(ua).any; // eslint-disable-line

    return app;
  }

  const appClient = configureApp(socketio(socket, {
    timeout: 20000
  }));

  if (__CLIENT__) {
    const userAgent = navigator && navigator.userAgent;
    appClient.isSpider = isBot(userAgent);
    appClient.isMobile = new IsMobile(userAgent).any;
    window.isMobile = appClient.isMobile;
  }

  return appClient;
}
