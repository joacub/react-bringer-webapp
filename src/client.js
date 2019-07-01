/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { AppContainer as HotEnabler } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { trigger } from 'redial';
import { createBrowserHistory } from 'history';
import { loadableReady } from '@loadable/component';
import { getStoredState } from 'redux-persist';
import localForage from 'localforage';
import { createApp, socket } from 'app';
import createStore from 'redux/create';
import apiClient from 'helpers/apiClient';
import routes from 'routes';
import isOnline from 'utils/isOnline';
import asyncMatchRoutes from 'utils/asyncMatchRoutes';
import Provider from 'components/Provider/Provider';
import RouterTrigger from 'components/RouterTrigger/RouterTrigger';
import getPageContext from 'components/Context/createThemeContext';
import { addLocaleData } from 'react-intl';
import esLocaleData from 'react-intl/locale-data/es';
import closest from 'utils/polyfill/closest';
import NProgress from 'nprogress';
import { setCookie, setUser, setToken } from 'utils/auth/helpers';
import cookie from 'js-cookie';
import raf from 'raf';

raf.polyfill();

// polyfill localstorage
const isStorage = () => {
  try {
    return 'localStorage' in window && window.localStorage != null;
  } catch (e) {
    return false;
  }
};

if (!isStorage()) {
  window.localStorage = {
    _data: {},
    setItem(id, val) { this._data[id] = String(val); return this._data[id]; },
    getItem(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
    removeItem(id) { return delete this._data[id]; },
    clear() { this._data = {}; return this._data; }
  };
}

NProgress.configure({ trickleSpeed: 200 });

closest(window);


(async () => {
  if (global.Intl) {
    // // Determine if the built-in `Intl` has the locale data we need.
    // if (!areIntlLocalesSupported(localesMyAppSupports)) {
    //     // `Intl` exists, but it doesn't have the data we need, so load the
    //     // polyfill and patch the constructors we need with the polyfill's.
    //     var IntlPolyfill    = require('intl');
    //     Intl.NumberFormat   = IntlPolyfill.NumberFormat;
    //     Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    // }
  } else {
    // No `Intl`, so use and load the polyfill.
    const getIntl = () => import(/* webpackChunkName: 'intl-polyfill' */ 'intl');
    global.Intl = await getIntl().then(r => r.__esModule ? r.default : r);
  }

  // import IntlPolyfill from 'intl';
  // import 'intl/locale-data/jsonp/es';

  // Intl.NumberFormat = IntlPolyfill.NumberFormat;
  // Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

  addLocaleData(esLocaleData);

  const { locale, messages } = window.App;

  const persistConfig = {
    key: 'root',
    storage: localForage,
    stateReconciler(inboundState, originalState) {
      // Ignore state from cookies, only use preloadedState from window object
      return originalState;
    },
    whitelist: ['auth', 'settings', 'info', 'chat']
  };

  const dest = document.getElementById('content');

  const app = createApp();
  const restApp = createApp('rest');
  const client = apiClient();
  const providers = {
    app, restApp, client, intl: { lang: locale, messages }
  };

  const initSocket = () => socket;

  global.socket = initSocket();

  const preloadedState = await getStoredState(persistConfig);
  const online = window.__data ? true : await isOnline();

  let onlineState = {};
  if (online) {
    socket.open();
    app.on('login', response => {
      setCookie({ app })(response);
      setToken({ client, app, restApp })(response);
      setUser({ app, restApp })(response);
    });

    app.on('logout', () => {
      setToken({ client, app, restApp })({ accessToken: null });
      cookie.remove('feathers-jwt');
    });
    const result = await app.authenticate().then(r => {
      app.set('accessToken', r.accessToken);
      app.set('user', r.user);
      return r;
    }).catch(e => {
      if (e.name === 'NotAuthenticated' && window.__data && window.__data.auth) {
        setToken({ client, app, restApp })({ accessToken: null });
        cookie.remove('feathers-jwt');
        window.__data.auth.user = null;
      }
    });
    if (window.__data && result) {
      window.__data.auth.user = result.user;
    }
  } else {
    onlineState = {
      online: {
        isOnline: false
      }
    };
  }

  const history = createBrowserHistory();
  const store = createStore({
    history,
    data: {
      ...preloadedState,
      ...window.__data,
      ...onlineState
    },
    helpers: providers,
    persistConfig
  });

  const pageContext = getPageContext(store.getState().settings.uiTheme);

  const triggerHooks = async (_routes, pathname) => {
    NProgress.start();

    const { components, match, params } = await asyncMatchRoutes(_routes, pathname);
    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    await trigger('inject', components, triggerLocals);

    // Don't fetch data for initial route, server has already done the work:
    if (window.__PRELOADED__) {
      // Delete initial data so that subsequent data fetches can occur:
      delete window.__PRELOADED__;
    } else {
      // Fetch mandatory data dependencies for 2nd route change onwards:
      await trigger('fetch', components, triggerLocals);
    }
    await trigger('defer', components, triggerLocals);

    NProgress.done();
  };

  const hydrate = async _routes => {
    const element = (
      <HotEnabler>
        <Provider store={store} pageContext={pageContext} {...providers}>
          <Router history={history}>
            <RouterTrigger trigger={pathname => triggerHooks(_routes, pathname)}>
              {renderRoutes(_routes)}
            </RouterTrigger>
          </Router>
        </Provider>
      </HotEnabler>
    );

    if (dest.hasChildNodes()) {
      ReactDOM.hydrate(element, dest);
    } else {
      ReactDOM.render(element, dest);
    }
  };

  // await Loadable.preloadReady();
  await loadableReady();

  hydrate(routes);

  // Hot reload
  if (module.hot) {
    module.hot.accept('./routes', () => {
      const nextRoutes = require('./routes');
      hydrate(nextRoutes.__esModule ? nextRoutes.default : nextRoutes).catch(err => {
        console.error('Error on routes reload:', err);
      });
    });
  }

  // Server-side rendering check
  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger
  }

  // Service worker
  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
      registration.onupdatefound = () => {
        // The updatefound event implies that reg.installing is set; see
        // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
        const installingWorker = registration.installing;

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and the fresh content will
                // have been added to the cache.
                // It's the perfect time to display a "New content is available; please refresh."
                // message in the page's interface.
                if (console && console.log) {
                  console.log('New or updated content is available.');
                }
              } else if (console && console.log) {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                console.log('Content is now available offline!');
              }
              break;
            case 'redundant':
              if (console && console.error) {
                console.error('The installing service worker became redundant.');
              }
              break;
            default:
          }
        };
      };
    } catch (error) {
      if (console && console.log) {
        console.log('Error registering service worker: ', error);
      }
    }

    await navigator.serviceWorker.ready;
    if (console && console.log) {
      console.log('Service Worker Ready');
    }
  }
})().catch(e => {
  if (!__DEVELOPMENT__) {
    window.__wm_injectImgEvent(`${e.toString()} => ${window.location.host + window.location.pathname}`);
  }
});
