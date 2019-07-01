/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet-async';
import withStyles from '@material-ui/core/styles/withStyles';
import { changeTheme } from 'redux/modules/settings';
import HeaderApp from 'components/HeaderApp/HeaderApp';
import Notifs from 'components/Notifs/Notifs';
import config from 'config';
import ReactGA from 'react-ga';
import NotifComponent from 'components/NotifComponent/NotifComponent';

const styles = theme => ({
  '@keyframes nprogress-spinner': {
    '0%': {
      transform: 'rotate(0deg)'
    },

    '100%': {
      transform: 'rotate(360deg)'
    }
  },
  '@global': {
    '.react-hot-loader-error-overlay': {
      position: 'absolute',
      zIndex: 9999999
    },
    html: {
      WebkitFontSmoothing: 'antialiased',
      // Antialiasing.
      MozOsxFontSmoothing: 'grayscale',
      // Antialiasing.
      // Change from `box-sizing: content-box` so that `width`
      // is not affected by `padding` or `border`.
      boxSizing: 'border-box',
      fontFamily: 'sans-serif',
      '-ms-text-size-adjust': '100%',
      '-webkit-text-size-adjust': '100%',
    },
    '@media screen and (max-device-width:1000px)': {
      html: {
        '-webkit-text-size-adjust': 'none'
      }
    },
    '*, *::before, *::after': {
      boxSizing: 'inherit'
    },
    body: {
      background: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.grey[900],
      margin: 0,
      paddingTop: 65,
      letterSpacing: 0,
      fontWeight: 400,
      fontStyle: 'normal',
      textRendering: 'optimizeLegibility',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      '-moz-font-feature-settings': '"liga" on',
      color: 'rgba(0,0,0,.84)',
      fontSize: 20,
      lineHeight: 1.4,
      '@media print': {
        // Save printer ink.
        backgroundColor: theme.palette.common.white,
      },
    },
    pre: {
      margin: 0
    },
    '#content': {
      overflow: 'hidden'
    },
    '.no-js': {
      '& .img-no-webp': {
        display: 'none',
        backgroundImage: 'none!important'
      },
      '& .img-webp': {
        display: 'none',
        backgroundImage: 'none!important'
      },
    },
    'html.js:not(.webp):not(.no-webp)': {
      '& .img-no-webp': {
        display: 'none',
        backgroundImage: 'none!important'
      },
      '& .img-webp': {
        display: 'none',
        backgroundImage: 'none!important'
      },
    },
    'html.js.webp': {
      '& .img-no-webp': {
        display: 'none',
        backgroundImage: 'none!important'
      },
      '& .img-webp': {
        display: 'inherit'
      },
    },
    'html.js.no-webp': {
      '& .img-no-webp': {
        display: 'inherit'
      },
      '& .img-webp': {
        display: 'none',
        backgroundImage: 'none!important'
      },
    },
    '.links': {
      color: theme.palette.type === 'light' ? '#1070e0' : '#69c',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
        color: theme.palette.type === 'light' ? 'rgba(16,112,224,0.85)' : '#98caff'
      },
      '&:focus': {
        color: theme.palette.type === 'light' ? 'rgba(16,112,224,0.85)' : '#98caff'
      }
    },
    'h1,h2,h3,h4,h5,h6': {
      letterSpacing: 0,
      fontWeight: 700,
      fontStyle: 'normal'
    },
    a: {
      color: 'inherit',
      textDecoration: 'none'
    },
    '.headerWrapper': {
      position: 'relative',
      zIndex: 10
    },
    '.headerBackground': {
      transition: 'height 300ms ease-in 2s',
      transitionProperty: 'height',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-in',
      transitionDelay: '100ms',

      height: 300,
      background: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
      backgroundImage: theme.palette.type === 'light' ? theme.palette.common.white : theme.palette.common.black,
      backgroundRepeat: 'repeat-x',
      filter:
        // eslint-disable-next-line
        "progid: DXImageTransform.Microsoft.gradient(startColorstr= '#FF2364A7', endColorstr= '#FF15497B', GradientType=1)"
    },
    '.appBarAnimation': {
      transition: 'background 300ms ease-in 2s',
      transitionProperty: 'background',
      transitionDuration: '300ms',
      transitionTimingFunction: 'ease-in',
      transitionDelay: '100ms'
    },
    '.is404Body': {
      background: '#2364A7',
      backgroundImage: 'linear-gradient(to right, #2364A7 0%, #15497B 100%)',
      backgroundRepeat: 'repeat-x',
      filter:
        // eslint-disable-next-line
        "progid: DXImageTransform.Microsoft.gradient(startColorstr= '#FF2364A7', endColorstr= '#FF15497B', GradientType=1)"
    },
    '.appBar': {
      background: 'transparent',
      color: '#fff'
    },
    '.appContent': {
      position: 'relative'
    },
    '.notifs': {
      // margin: '15px 0'
    },
    '.topBar': {
      position: 'relative',
      width: '100%',
      zIndex: 22,
      fontSize: 12,
      textAlign: 'right'
    },
    '.flagSelect': {
      marginRight: 10
    },
    '.titleLive': {
      color: '#fff',
      fontSize: 26,

      '& strong': {
        color: '#000',
        background: '#fff'
      }
    },
    '.clearfix:before, .clearfix:after': {
      content: '"."',
      display: 'block',
      height: 0,
      overflow: 'hidden'
    },

    '.clearfix:after': {
      clear: 'both'
    },

    '.clearfix': {
      zoom: 1
    },

    // '.error.error': {
    //   backgroundColor: 'transparent'
    // },

    '.fancy': {
      lineHeight: 0.1,
      textAlign: 'center',

      '& span': {
        display: 'inline-block',
        position: 'relative'
      },
      '& span:before, span:after': {
        content: '""',
        position: 'absolute',
        height: 5,
        borderBottom: '1px solid #eeeeee',
        top: 0,
        width: 600
      },

      '& span:before': {
        right: '100%',
        marginRight: 15
      },

      '& span:after': {
        left: '100%',
        marginLeft: 15
      }
    },
    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        background: '#34e79a',
        position: 'fixed',
        zIndex: 10317777,
        top: 0,
        left: 0,
        width: '100%',
        height: 2
      },
      '& .peg': {
        display: 'block',
        position: 'absolute',
        right: 0,
        width: 100,
        height: '100%',
        boxShadow: '0 0 10px #34e79a, 0 0 5px #34e79a',
        opacity: 1.0,
        transform: 'rotate(3deg) translate(0px, -4px)'
      },
      '& .spinner': {
        display: 'block',
        position: 'fixed',
        zIndex: 1031,
        top: 15,
        right: 15
      },
      '& .spinner-icon': {
        width: 18,
        height: 18,
        boxSizing: 'border-box',
        border: 'solid 2px transparent',
        borderTopColor: '#34e79a',
        borderLeftColor: '#34e79a',
        borderRadius: '50%',
        animation: 'nprogress-spinner 400ms linear infinite',
        animationName: '$nprogress-spinner',
      }
    },

    '.nprogress-custom-parent': {
      overflow: 'hidden',
      position: 'relative',
      '& #nprogress': {
        '& .spinner, .bar': {
          position: 'absolute'
        }
      }
    },
    '@media (max-width: 600px)': {
      '.textCenterXs': {
        textAlign: 'center'
      },
      '.titleLive': {
        fontSize: 19
      }
    },
    '@global .animate-icon': {
      width: 38,
      height: 38
    },
    '@media screen and (max-width: 767px)': {
      body: {
        paddingTop: 56
      }
    }
  },
  headerLogo: {
    width: '100%',
    height: '100%'
  },
  titleHeaderApp: {
    fontWeight: 'bold'
  },
  containerPublicationLogo: {
    height: 65,
    marginRight: 18,
    display: 'flex',
    alignItems: 'center'
  },
  publicationLogoA: {
    lineHeight: 1
  },
  publicationLogoIMG: {
    marginTop: 5
  },
  avatarPublicPublciation: {
    width: 32,
    height: 32
  },
});

ReactGA.initialize('UA-EXAMPLE_GA-1');
const trackPage = page => {
  ReactGA.set({
    page
  });
  ReactGA.pageview(page);
};
@withStyles(styles, { name: 'AppWrapper' })
export default class AppWrapper extends Component {
  static propTypes = {
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    logout: PropTypes.func.isRequired,
    notifs: PropTypes.shape({
      global: PropTypes.array
    }).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    notifDismiss: PropTypes.func.isRequired,
    changeTheme: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    lang: PropTypes.string.isRequired,
  };

  static defaultProps = {
    user: null,
  };

  componentDidMount() {
    window.addEventListener('online', this.checkIfIsOnline);
    window.addEventListener('offline', this.checkIfIsOnline);

    const { isOnlineAction } = this.props;
    if (isOnlineAction) {
      this.intervalIsOnline = setInterval(() => {
        isOnlineAction();
      }, 30000);
    }

    const { location } = this.props;
    ReactGA.pageview(location.pathname + location.search);
    // Remove the server-side injected CSS.

    const jssStylesBlankHtml = document.querySelector('#pg-loading-screen');
    if (jssStylesBlankHtml && jssStylesBlankHtml.parentNode) {
      jssStylesBlankHtml.parentNode.removeChild(jssStylesBlankHtml);
    }

    const jssStylesBlank = document.querySelector('#server-side-styles-blank-page');
    if (jssStylesBlank && jssStylesBlank.parentNode) {
      jssStylesBlank.parentNode.removeChild(jssStylesBlank);
    }

    const jssStyles = document.querySelector('#server-side-styles');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }

    const links = document.querySelectorAll('link[media="none"]');
    if (links) {
      for (let i = 0; i < links.length; i += 1) {
        const link = links[i];
        link.media = 'screen, projection';
        link.rel = 'stylesheet';
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { isOnlineAction } = this.props;
    if (isOnlineAction && !this.intervalIsOnline) {
      clearInterval(this.intervalIsOnline);
      this.intervalIsOnline = setInterval(() => {
        isOnlineAction();
      }, 30000);
    }

    const { location, history, user } = this.props;
    const nextPage = location.pathname + location.search;
    const currentPage = prevProps.location.pathname + prevProps.location.search;

    if (currentPage !== nextPage) {
      trackPage(nextPage);
    }

    if (!user && prevProps.user) {
      // login
      const redirect = location.query && location.query.redirect;
      history.push(redirect || '/login-success');
    } else if (user && !prevProps.user) {
      // logout
      history.push('/');
    }

    if (
      location.pathname.indexOf('/page') === -1
    ) {
      if (location !== prevProps.location) {
        window.scrollTo(0, 0);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.checkIfIsOnline);
    window.removeEventListener('offline', this.checkIfIsOnline);

    if (this.intervalIsOnline) {
      clearInterval(this.intervalIsOnline);
      this.intervalIsOnline = false;
    }
  }

  checkIfIsOnline = () => {
    const { isOnlineAction } = this.props;
    isOnlineAction();
  }

  handleCloseNotif = id => {
    const { notifDismiss } = this.props;
    notifDismiss(id);
  };

  handleLogout = event => {
    const { logout: logoutReducer } = this.props;
    event.preventDefault();
    logoutReducer();
  };

  render() {
    const {
      notifs,
      route,
      location,
      user,
      loadingMeStories,
      saved,
      isOnline,
      isOnlineAction,
      isOnlineLoading,
    } = this.props;


    const content = renderRoutes(route.routes);
    return (
      <React.Fragment>
        <Helmet {...config.app.head} />
        <HeaderApp
          isOnline={isOnline}
          isOnlineAction={isOnlineAction}
          isOnlineLoading={isOnlineLoading}
          position="fixed"
          location={location}
          user={user}
          loading={loadingMeStories}
          saved={saved}
          logout={this.handleLogout}
          changeTheme={changeTheme}
        />

        {notifs.global && (
          <Notifs
            key="notifs"
            className="notifs"
            namespace="global"
            handleCloseNotif={this.handleCloseNotif}
            NotifComponent={NotifComponent}
          />
        )}

        {content}
      </React.Fragment>
    );
  }
}
