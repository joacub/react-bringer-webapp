import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import provideHooks from 'redial/lib/provideHooks';
import { StylesProvider, ThemeProvider } from '@material-ui/styles';
import { changeTheme } from 'redux/modules/settings';
import getPageContext, { updatePageContext } from 'components/Context/createThemeContext';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import withTheme from 'hoc/withTheme';
import isEqual from 'lodash.isequal';
import qs from 'qs';
import * as notifActions from 'redux/modules/notifs';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { load as isOnline } from 'redux/modules/online';
import AppWrapper from './AppWrapper';

@withRouter
@provideHooks({
  fetch: async ({
    app, client, restApp, store: { dispatch, getState }
  }) => {
    const promises = [];

    const state = getState();
    if (!isAuthLoaded(state, { app, client, restApp })) {
      promises.push(dispatch(loadAuth()).catch(() => null));
    }

    await Promise.all(promises);
  },
})
@connect(
  state => ({
    isOnline: state.online.isOnline,
    isOnlineLoading: state.online.loading,
    notifs: state.notifs,
    uiTheme: state.settings.uiTheme,
    lang: state.settings.lang,
    user: state.auth.user,
  }),
  {
    logout,
    notifDismiss: notifActions.notifDismiss,
    changeTheme,
    isOnlineAction: isOnline
  }
)
@withTheme
export default class App extends Component {
  static propTypes = {
    uiTheme: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    pageContext: PropTypes.objectOf(PropTypes.any).isRequired,
    lang: PropTypes.string.isRequired,
    changeTheme: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    })
  };

  static defaultProps = {
    user: null
  };

  constructor(props) {
    super(props);
    this.changeTheme = this.changeTheme.bind(this);
    this.state = {
      prevProps: props,
      user: props.user,
      pageContext: props.pageContext
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevProps } = prevState;

    const user = !isEqual(prevProps.user, nextProps.user) ? nextProps.user : prevState.user;

    if (!prevProps.user && nextProps.user) {
      const query = qs.parse(nextProps.location.search, { ignoreQueryPrefix: true });
      if (query.redirect === '/') {
        delete query.redirect;
      }
      nextProps.history.push(query.redirect || '/login-success');
    } else if (prevProps.user && !nextProps.user) {
      // logout
      nextProps.history.push('/');
    } else if (nextProps.user) {
      const query = qs.parse(nextProps.location.search, { ignoreQueryPrefix: true });
      if (query.redirect && query.redirect !== '/') {
        nextProps.history.push(query.redirect);
      }
    }

    if (typeof prevState.pageContext === 'undefined') {
      return {
        user,
        prevProps: nextProps,
        pageContext: nextProps.pageContext || getPageContext(nextProps.uiTheme)
      };
    }

    if (
      nextProps.uiTheme.paletteType !== prevProps.uiTheme.paletteType
      || nextProps.uiTheme.direction !== prevProps.uiTheme.direction
    ) {
      return {
        user,
        prevProps: nextProps,
        pageContext: updatePageContext(nextProps.uiTheme)
      };
    }

    return {
      // Store the previous props in state
      prevProps: nextProps,
      user
    };
  }

  changeTheme() {
    const { changeTheme: changeThemeReducer, uiTheme } = this.props;
    changeThemeReducer({
      ...uiTheme,
      paletteType: uiTheme.paletteType === 'dark' ? 'light' : 'dark'
    });
  }

  render() {
    const { pageContext } = this.state;
    const { location, history } = this.props;
    const paramsToTheme = process.browser || process.env.NODE_ENV !== 'production' ? {} : { sheetsCache: pageContext.sheetsCache };
    return (
      <StylesProvider
        generateClassName={pageContext.generateClassName}
        jss={pageContext.jss}
        {...paramsToTheme}
      >
        <ThemeProvider
          theme={pageContext.theme}
        >
          <ErrorBoundary location={location} history={history}>
            <AppWrapper {...this.props} changeTheme={this.changeTheme} />
          </ErrorBoundary>
        </ThemeProvider>
      </StylesProvider>
    );
  }
}
