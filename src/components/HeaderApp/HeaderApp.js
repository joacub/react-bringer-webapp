import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import RootRef from '@material-ui/core/RootRef';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import pathToRegexp from 'path-to-regexp';
import IconButton from '@material-ui/core/IconButton/IconButton';
import AvatarIcon from '@material-ui/icons/AccountCircleOutlined';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import shallowEqual from 'recompose/shallowEqual';
import AppSearch from 'components/Search/Search';
import Container from 'components/Container/Container';
import LogoSymbol from '@material-ui/icons/FlightLandOutlined';
import classNames from 'clsx';
import ListItem from '@material-ui/core/ListItem';
import capitalize from 'lodash.capitalize';
import { getContrastRatio } from '@material-ui/core/styles/colorManipulator';
import getImageLink from 'utils/getImageLink';
import userCan from 'utils/userCan';
import Menu from 'components/Menu/Menu';
import { FormattedMessage } from 'react-intl';
import Hidden from '@material-ui/core/Hidden';
import withLocale from 'hoc/withLocale';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

const delta = 5;

const getDocScroll = () => {
  const doc = document.documentElement;
  const left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  return { top, left };
};

const styles = {
  root: {
    display: 'flex'
  },
  grow: {
    flex: '1 1 auto'
  },
  logoHeader: {
    width: 45,
    marginTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
    fill: '#ffffff',
    backgroundColor: '#000000'
  },
  headerRoot: {
    // background: '#fff',
    background: 'rgba(255,255,255,.97)',
    border: 0,
    boxShadow: 'none'
  },
  headerWrap: {
    color: 'rgba(0,0,0,.54)',
    fontSize: 16,
    fontFamily: [
      'wm-content-sans-serif-font',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      '"Open Sans"',
      '"Helvetica Neue"',
      'sans-serif'
    ].join(','),
    '-webkit-transition': '-webkit-transform .3s',
    transition: 'transform .3s',
    fallbacks: [{ transition: '-webkit-transform .3s' }, { transition: 'transform .3s, -webkit-transform .3s' }],
    '-webkit-transform': 'translateY(0%)',
    transform: 'translateY(0%)'
  },
  headerBorder: {
    '-webkit-box-shadow': '0 2px 2px -2px rgba(0,0,0,.15)',
    boxShadow: '0 2px 2px -2px rgba(0,0,0,.15)'
  },
  toolbar: {
    padding: 0,
    width: '100%'
  },
  navUp: {
    '-webkit-transform': 'translateY(-100%)',
    transform: 'translateY(-100%)'
  },
  navDown: {},
  colorAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#000000'
  },
  imageAvatarPublication: {
    width: 32,
    height: 32
  },
  popover: {
    width: 220,
    marginTop: 10,
    overflowY: 'visible',
    overflowX: 'visible'
  },
  popoverArrow: {
    position: 'absolute',
    left: '50%',
    marginLeft: -7,
    top: -14,
    clip: 'rect(0 18px 14px -4px)',

    '&:after': {
      content: '""',
      display: 'block',
      width: 14,
      height: 14,
      background: '#fff',

      '-webkit-transform-style': 'rotate(45deg) translate(6px,6px)',
      transform: 'rotate(45deg) translate(6px,6px)',
      '-webkit-box-shadow': '-1px -1px 1px -1px rgba(0,0,0,.54)',
      boxShadow: '-1px -1px 1px -1px rgba(0,0,0,.54)'
    }
  },
  // blur: {
  //   '& .appContent, $headerWrap, footer': {
  //     pointerEvents: 'none',
  //     userSelect: 'none',
  //     overflow: 'hidden',
  //     opacity: 0.7,
  //     '-webkit-filter': 'blur(0.5px)',
  //     filter: 'blur(0.5px)',
  //     fallbacks: [
  //       {
  //         filter: 'progid:DXImageTransform.Microsoft.Blur(PixelRadius=1, MakeShadow=false)'
  //       }
  //     ]
  //   }
  // },
  statusPost: {
    marginLeft: 20
  },
  separationButtons: {
    marginRight: 8
  },
  headerContainerBackground: {},
  headerContainerBackgroundBg: {},
  headerBackgroundAspectRatioFullWith: {},
  headerBackgroundAspectRatioCell: {},
  headerHero: {},
  headerSmall: {
    '& $headerHero': {
      '-webkit-box-flex': 1,
      '-webkit-flex': '1 0 auto',
      '-ms-flex': '1 0 auto',
      flex: '1 0 auto'
    },
    '& $overlayBackground': {
      display: 'none'
    }
  },
  headerMedium: {
    position: 'relative',
    display: 'table',
    width: '200%',
    tableLayout: 'fixed',

    '& $headerHero': {
      paddingTop: 20,
      paddingBottom: 20,
      paddingRight: 20,
      width: '100%',
      height: '100%',
      display: 'table'
    },
    '& $headerContainerBackgroundBg': {
      position: 'relative',
      display: 'table-cell',
      width: '50%',
      verticalAlign: 'middle',
      overflow: 'hidden',
      backgroundSize: 'cover'
    },
    '& $headerBackgroundAspectRatioCell': {
      display: 'table-cell',
      width: '50%',
      verticalAlign: 'top'
    },
    '& $headerBackgroundAspectRatioFullWith': {
      display: 'block',
      maxHeight: 300,
      '&:after': {
        content: "''",
        display: 'block',
        width: '100%',
        height: 0,
        paddingBottom: '12%'
      }
    }
  },
  headerLarge: {
    position: 'relative',
    display: 'table',
    width: '200%',
    tableLayout: 'fixed',
    '& $headerHero': {
      paddingTop: 20,
      paddingBottom: 20,
      paddingRight: 20,
      width: '100%',
      height: '100%',
      display: 'table'
    },
    '& $headerBackgroundAspectRatioCell': {
      display: 'table-cell',
      width: '50%',
      varticalAlign: 'top'
    },
    '& $headerContainerBackgroundBg': {
      position: 'relative',
      display: 'table-cell',
      width: '50%',
      verticalAlign: 'middle',
      overflow: 'hidden',
      backgroundSize: 'cover'
    },
    '& $headerBackgroundAspectRatioFullWith': {
      display: 'block',
      maxHeight: 700,
      '&:after': {
        content: "''",
        display: 'block',
        width: '100%',
        height: 0,
        paddingBottom: '36%'
      }
    }
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(0,0,0,.175)',
    height: '100vh'
  },
  tagline: {
    fontWeight: 400
  },
  textWhite: {
    color: 'rgba(255, 255, 255, 1)'
  },
  avatarCenter: {
    margin: '0 auto'
  },
  iconButton: {
    padding: 5
  },
  containerAfterOverlay: {
    position: 'relative',
    zIndex: 100
  },
  logoContainerlogo: {},
  logoContainerboth: {},
  aligncenter: {
    '& $headerHero': {
      textAlign: 'center'
    }
  },
  alignleft: {},
  separatorMainLogoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  separatorMainLogo: {
    borderRight: '1px solid rgba(0,0,0,.15)',
    marginLeft: 15,
    marginRight: 20,
    height: 28,
    display: 'inline-block'
  },
  metaBar: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 16
  },
  // overFlowTrickNav: {
  //   bottom: -18,
  //   height: 65,
  //   display: 'flex',
  //   position: 'relative',
  //   overflowY: 'hidden',
  // },
  navTopics: {
    overflow: 'hidden'
  },
  topicNavLink: {
    color: 'rgba(0,0,0,.54)',
    marginLeft: 24,
    fontFamily: 'wm-content-sans-serif-font,"Lucida Grande","Lucida Sans Unicode","Lucida Sans",Geneva,Arial,sans-serif!important',
    fontWweight: 400,
    fontStyle: 'normal',
    fontSize: 15,
    lineHeight: '20px',
    transform: 'translateY(1.8px)',
    letterSpacing: '.05em',
    textTransform: 'uppercase',
    '&:first-child': {
      marginLeft: 0
    },
    '&:hover': {
      color: 'rgba(0,0,0,.84)',
    }
  },
  tabsFlexContainer: {
    height: 48
  },
  tabsRoot: {
    position: 'relative',
    borderBottom: '0',
    // '& > $tabsFlexContainer': {
    // borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    // }
  },
  scrollButtons: {
    position: 'absolute',
    left: 0,
    top: -1,
    bottom: 1,
    zIndex: 99,
    background: '#fff',
    width: 'auto',
    marginTop: 6,
  },
  tabsScroller: {
    position: 'relative',
    bottom: -1,
    display: 'flex',
    height: 60,
    overflowY: 'hidden',
    // '& $tabsFlexContainer': {
    //   borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    // }
    '&+$scrollButtons': {
      left: 'auto',
      right: 0
    }
  },
  tabsIndicator: {
    height: 1,
    top: 46,
    backgroundColor: 'rgba(0, 0, 0, 0.54)'
  },
  tabRoot: {
    opacity: 1,
    padding: 0,
    minWidth: 0,
    color: 'rgba(0,0,0,.54)',
    marginLeft: 24,
    fontFamily: 'wm-content-sans-serif-font,"Lucida Grande","Lucida Sans Unicode","Lucida Sans",Geneva,Arial,sans-serif!important',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 15,
    lineHeight: '20px',
    transform: 'translateY(1.8px)',
    letterSpacing: '.05em',
    textTransform: 'uppercase',
    '&:first-child': {
      marginLeft: 0
    },
    '&:hover': {
      color: 'rgba(0,0,0,.84)',
    },
    '&$tabSelected': {
      color: 'rgba(0, 0, 0, 0.84)',
    },
    '&:focus': {
      color: 'rgba(0, 0, 0, 0.84)'
    }
  },
  tabSelected: {},
  '@media screen and (max-width: 767px)': {
    metaBar: {
      height: 39,
    },
    tabsRoot: {
      height: 39,
      minHeight: 39,
      transform: 'translateY(-6.8px)',
    },
    tabsFlexContainer: {
      height: 39
    },
    tabsScroller: {
      height: 51,
    },
    tabsIndicator: {
      top: 37
    },
    scrollButtons: {
      marginTop: 14
    }
  },
  '@global': {
    '.medium-zoom--opened ._headerWrapGlobal': {
      transform: 'translateY(-100%)',
      '-webkit-transform': 'translateY(-100%)',
    },
    '.no-hiddenscroll': {
      '& $tabsScroller': {
        bottom: -4,
        height: 61,
      },
      '& $tabsIndicator': {
        top: 43,
      }
    },
  },
  wrapperIsOnline: {
    position: 'fixed',
    overflow: 'visible',
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    lineHeight: '50px',
    '& ~ *': {
      transform: 'translateY(+50px)'
    }
  },
  containerIsOnline: {
    position: 'fixed',
    backgroundColor: '#ffa000',
    borderBottom: '1px solid red',
    color: '#fff',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    lineHeight: '50px',
    textAlign: 'center',
  },
  buttonDownConn: {
    position: 'relative',
    top: 50
  },
  wrapperConn: {
    textAlign: 'center'
  },
  buttonProgress: {
    position: 'absolute',
    color: green[500],
    top: '50%',
    left: '50%',
    marginTop: 38,
    marginLeft: -12,
  },
};

class HeaderApp extends Component {
  didScroll = false;

  interval = false;

  lastScrollTop = 0;

  navbarHeight = 0;

  timeout = false;

  timeoutCountWords = false;

  saved = null;

  static propTypes = {
    backgroundColor: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    contentAfterSeparator: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    headerLogo: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    publication: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    backgroundImage: PropTypes.objectOf(PropTypes.any),
    separatorMainLogo: PropTypes.bool,
    loading: PropTypes.bool,
    user: PropTypes.objectOf(PropTypes.any),
    post: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    postPublic: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    logout: PropTypes.func,
    restoreToUnsaveState: PropTypes.func.isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    size: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
    tagline: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.string]),
    disableHidden: PropTypes.bool,
    demoMode: PropTypes.bool,
    saved: PropTypes.bool,
    position: PropTypes.string,
    layout: PropTypes.string,
    isOnline: PropTypes.bool,
    align: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
  };

  static defaultProps = {
    logout: () => { },
    isOnline: true,
    isOnlineLoading: false,
    position: 'static',
    backgroundColor: false,
    publication: false,
    size: 's',
    layout: 'title',
    title: '',
    tagline: '',
    backgroundImage: {},
    loading: null,
    post: false,
    postPublic: false,
    user: null,
    disableHidden: false,
    demoMode: false,
    separatorMainLogo: false,
    contentAfterSeparator: false,
    headerLogo: false,
    align: false,
    saved: true,
  };

  constructor(props) {
    super(props);
    this.navbar = React.createRef();
  }

  state = {
    drawer: {
      top: false,
      left: false,
      bottom: false,
      right: false
    },
    wordsSelected: 0,
    anchorEl: null,
    anchorElPublication: null,
    scrollUp: true,
    navbarBorder: false,
    position: 'fixed',
    disableHidden: false,
    demoMode: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.location !== prevState.location) {
      return { location: nextProps.location, navbarBorder: false };
    }
    return null;
  }

  componentDidMount() {
    const { disableHidden, demoMode } = this.props;

    this.didScroll = true;
    this.navbarHeight = this.navbar.current.clientHeight;

    const contentNode = document.querySelector('.public-DraftEditor-content');
    if (contentNode) {
      if (!disableHidden && !demoMode) {
        window.removeEventListener('scroll', this.handleScroll);
      }
      contentNode.addEventListener('keydown', this.handleKeydownContent);
      contentNode.addEventListener('mouseup', this.handleMouseupContent);
      contentNode.addEventListener('keyup', this.handleMouseupContent);
      contentNode.addEventListener('selectstart', this.handleMouseupContent);
    } else if (!disableHidden && !demoMode) {
      window.addEventListener('scroll', this.handleScroll);
      this.interval = setInterval(() => {
        if (this.didScroll) {
          this.hasScrolled();
          this.didScroll = false;
        }
      }, 50);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(nextProps, this.props) || !shallowEqual(nextState, this.state);
  }

  componentDidUpdate() {
    const { disableHidden, demoMode } = this.props;
    const contentNode = document.querySelector('.public-DraftEditor-content');
    if (contentNode) {
      if (!disableHidden && !demoMode) {
        window.removeEventListener('scroll', this.handleScroll);
      }
      contentNode.addEventListener('keydown', this.handleKeydownContent);
      contentNode.addEventListener('mouseup', this.handleMouseupContent);
      contentNode.addEventListener('keyup', this.handleMouseupContent);
    } else if (!disableHidden && !demoMode) {
      window.removeEventListener('scroll', this.handleScroll);
      window.addEventListener('scroll', this.handleScroll);
      this.interval = setInterval(() => {
        if (this.didScroll) {
          this.hasScrolled();
          this.didScroll = false;
        }
      }, 50);
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    this.didScroll = true;
  };

  handleKeydownContent = e => {
    const {
      restoreToUnsaveState: restoreToUnsaveStateReducer,
      saved
    } = this.props;
    if (saved && e.key !== 'Meta' && !(e.key === 'r' && e.metaKey)) {
      restoreToUnsaveStateReducer(10);
    }
  };

  handleMouseupContent = () => {
    if (this.timeoutCountWords) {
      clearTimeout(this.timeoutCountWords);
    }

    this.timeoutCountWords = setTimeout(() => {
      const { wordsSelected } = this.state;
      const selection = window.getSelection();
      if (selection) {
        const text = selection.toString();
        if (text.trim()) {
          this.setState({ wordsSelected: text.trim().split(/\s+/).length });
          return;
        }
      }

      if (wordsSelected !== 0) {
        this.setState({ wordsSelected: 0 });
      }
    }, 50);
  };

  hasScrolled = () => {
    // const { classes } = this.props;
    const { scrollUp } = this.state;
    const st = getDocScroll().top;

    if (!scrollUp) {
      if (st < this.navbarHeight) {
        this.setState({ scrollUp: true, navbarBorder: false });
      }
    }
    // Make sure they scroll more than delta
    if (Math.abs(this.lastScrollTop - st) <= delta) {
      return;
    }
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > this.lastScrollTop && st > this.navbarHeight) {
      // Scroll Down
      this.setState({ scrollUp: false });
      // this.navbar.current.classList.remove(classes.navDown);
      // this.navbar.current.classList.add(classes.navUp);
    } else if (st + window.innerHeight < document.body.clientHeight) {
      // Scroll Up
      this.setState({ scrollUp: true, navbarBorder: st > this.navbarHeight });
      // this.navbar.current.classList.remove(classes.navUp);
      // this.navbar.current.classList.add(classes.navDown);
    }

    this.lastScrollTop = st;
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      drawer: {
        [side]: open
      }
    });
  };

  handleClickAvatar = event => {
    // const { classes } = this.props;
    // document.getElementById('content').classList.add(classes.blur);
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleCloseAvatar = () => {
    // const { classes } = this.props;
    // document.getElementById('content').classList.remove(classes.blur);
    this.setState({
      anchorEl: null
    });
  };

  handleClickPublicationAvatar = event => {
    // const { classes } = this.props;
    // document.getElementById('content').classList.add(classes.blur);
    this.setState({
      anchorElPublication: event.currentTarget
    });
  };

  handleClosePublicationAvatar = () => {
    // const { classes } = this.props;
    // document.getElementById('content').classList.remove(classes.blur);
    this.setState({
      anchorElPublication: null
    });
  };

  handleLogout = event => {
    const { logout } = this.props;
    this.handleCloseAvatar();
    logout(event);
  };

  render() {
    const {
      classes,
      post,
      postPublic,
      loading,
      location: { pathname },
      user,
      position,
      backgroundImage,
      size,
      title,
      tagline,
      backgroundColor,
      publication,
      contentAfterSeparator,
      headerLogo,
      separatorMainLogo,
      align,
      layout,
      saved,
      history,
      location,
      topics,
      isOnline,
      isOnlineAction,
      isOnlineLoading,
      localeContext: { intl }
    } = this.props;
    const {
      scrollUp, navbarBorder, anchorEl, anchorElPublication, wordsSelected
    } = this.state;

    const pathRegexEditPage = pathToRegexp('/me/stories/edit/:uid');
    const resultEdit = pathRegexEditPage.exec(pathname);

    const isEditPostPage = resultEdit && resultEdit[1];

    const headerClassname = classNames('_headerWrapGlobal', classes.headerWrap, {
      [classes.navUp]: !scrollUp && !isEditPostPage,
      [classes.navDown]: scrollUp && !isEditPostPage,
      [classes.headerBorder]: navbarBorder && !isEditPostPage,
    });

    let bgColorStyles = {};
    let contrastText = {};

    if (backgroundColor) {
      const contrastThreshold = 3;

      if (backgroundColor.length === 3 || backgroundColor.length === 6) {
        bgColorStyles = { backgroundColor: `#${backgroundColor}` };
        contrastText = getContrastRatio(`#${backgroundColor}`, '#000') <= contrastThreshold ? { color: '#fff' } : {};
      }
    }
    const styleBg = backgroundImage.src
      ? {
        ...bgColorStyles,
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundPositionX: `${backgroundImage.pos ? backgroundImage.pos.x : 50}%`,
        backgroundPositionY: `${backgroundImage.pos ? backgroundImage.pos.y : 50}%`
      }
      : bgColorStyles;

    return (
      <React.Fragment>
        {!isOnline && (
          <div className={classes.wrapperIsOnline}>
            <div className={classes.containerIsOnline}>
              {isOnlineLoading ? 'Restablishing connection' : 'Your connection is down'}
            </div>
            <div className={classes.wrapperConn}>
              <Button
                disabled={isOnlineLoading}
                className={classes.buttonDownConn}
                onClick={() => {
                  isOnlineAction();
                }}
                variant="outlined"
                size="small"
                color="primary"
              >
                {isOnlineLoading ? 'Reconnecting...' : 'Reconnect'}
              </Button>
              {isOnlineLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
          </div>
        )}
        <RootRef rootRef={this.navbar}>
          <AppBar classes={{ root: classes.headerRoot }} className={headerClassname} position={position}>
            <Container size="publicationSize">
              <Toolbar className={classes.toolbar}>
                <Typography component="div" color="inherit">
                  <Link className={classes.title} to="/">
                    <LogoSymbol className={classes.logoHeader} />
                    <Typography variant="srOnly">Homepage</Typography>
                  </Link>
                </Typography>
                {!!separatorMainLogo && (
                  <div className={classes.separatorMainLogoContainer}>
                    <span className={classes.separatorMainLogo} />
                  </div>
                )}
                {contentAfterSeparator && contentAfterSeparator}
                {isEditPostPage && (
                  <React.Fragment>
                    {wordsSelected !== 0 && (
                      <Typography variant="body2" className={classes.statusPost}>
                        {wordsSelected}
                        {' '}
                        words
                      </Typography>
                    )}
                    {wordsSelected === 0
                      && post
                      && post.status && (
                      <Typography variant="body2" className={classes.statusPost}>
                        {capitalize(post.status)}
                      </Typography>
                    )}
                    {wordsSelected === 0
                      && (loading) && (
                      <Typography variant="body2" color="textSecondary" className={classes.statusPost}>
                          Saving...
                      </Typography>
                    )}
                    {wordsSelected === 0
                      && loading === false
                      && saved && (
                      <Typography variant="body2" color="textSecondary" className={classes.statusPost}>
                          Saved
                      </Typography>
                    )}
                  </React.Fragment>
                )}
                <div className={classes.grow} />
                {!isEditPostPage && <AppSearch />}
                {!user && (
                  <Button
                    component={Link}
                    to={`/login${pathname !== '/login' ? `?redirect=${encodeURIComponent(pathname)}` : ''}`}
                    color="secondary"
                    variant="outlined"
                  >
                    <FormattedMessage
                      id="sign_in"
                      defaultMessage="Sign in"
                    />
                  </Button>
                )}
                {user && (
                  <React.Fragment>
                    <IconButton className={classes.iconButton} onClick={this.handleClickAvatar}>
                      <Avatar className={classes.colorAvatar}>
                        {user.avatar && user.avatar.id ? (
                          <img
                            className={classes.imageAvatarPublication}
                            alt="Avatar User"
                            src={getImageLink(user.avatar.md5, 'fit_c_64x64', user.avatar.format)}
                          />
                        ) : (
                          <AvatarIcon />
                        )}
                      </Avatar>
                    </IconButton>
                    {publication
                      && user
                      && publication.creator
                      && (publication.creator.uid === user.uid || userCan(user, 'all') || publication.isEditor) && (
                      <React.Fragment>
                        <IconButton className={classes.iconButton} onClick={this.handleClickPublicationAvatar}>
                          <img
                            className={classes.imageAvatarPublication}
                            alt={publication.name}
                            src={getImageLink(publication.avatar.md5, 'fit_c_64x64', publication.avatar.format)}
                          />
                        </IconButton>
                        <Menu
                          margin={-15}
                          anchorEl={anchorElPublication}
                          handleClosePopover={this.handleClosePublicationAvatar}
                        >
                          <List>
                            <ListItem>
                              <img
                                className={classes.avatarCenter}
                                alt={`Avatar of ${publication.name}`}
                                src={getImageLink(publication.avatar.md5, 'fit_c_160x160', publication.avatar.format)}
                                width={80}
                                height={80}
                              />
                            </ListItem>
                            <Divider />
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/stories/create`}
                              button
                            >
                              <FormattedMessage
                                id="newStory"
                                defaultMessage="New story"
                              />
                            </ListItem>
                            <Divider />
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/stories/drafts`}
                              button
                            >
                              <FormattedMessage
                                id="stories"
                                defaultMessage="Stories"
                              />
                            </ListItem>
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/stories/drafts`}
                              button
                            >
                              <FormattedMessage
                                id="stats"
                                defaultMessage="Stats"
                              />
                            </ListItem>
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/stories/drafts`}
                              button
                            >

                              <FormattedMessage
                                id="letters"
                                defaultMessage="Letters"
                              />
                            </ListItem>
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/stories/drafts`}
                              button
                            >
                              <FormattedMessage
                                id="followers"
                                defaultMessage="Followers"
                              />
                            </ListItem>
                            <Divider />
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/settings/navigation`}
                              button
                            >
                              <FormattedMessage
                                id="navigation"
                                defaultMessage="Navigation"
                              />
                            </ListItem>
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/settings/featured-pages`}
                              button
                            >
                              <FormattedMessage
                                id="featuredPages"
                                defaultMessage="Featured pages"
                              />
                            </ListItem>
                            <ListItem
                              onClick={this.handleClosePublicationAvatar}
                              component={Link}
                              to={`/${publication.slug}/settings`}
                              button
                            >
                              <FormattedMessage
                                id="homepageAndSettings"
                                defaultMessage="Homepage and settings"
                              />

                            </ListItem>
                          </List>
                          {/* <div className={classes.popoverArrow} /> */}
                        </Menu>
                      </React.Fragment>
                    )}
                    <Menu
                      margin={-15}
                      anchorEl={anchorEl}
                      handleClosePopover={this.handleCloseAvatar}
                    >
                      <List>
                        {postPublic
                          && (user.UserRole.role === 'admin' || user.uid === postPublic.User.uid) && (
                          <React.Fragment>
                            <ListItem
                              onClick={this.handleCloseAvatar}
                              component={Link}
                              to={`/me/stories/edit/${postPublic.uid}`}
                              button
                            >
                              <FormattedMessage
                                id="editStory"
                                defaultMessage="Edit story"
                              />
                            </ListItem>
                            <Divider />
                          </React.Fragment>
                        )}

                        {(user.UserRoleId === 1 || user.UserRoleId === 2) && (
                          <ListItem onClick={this.handleCloseAvatar} component={Link} to="/me/stories/create" button>
                            <FormattedMessage
                              id="newStory"
                              defaultMessage="New story"
                            />
                          </ListItem>
                        )}
                        <ListItem onClick={this.handleCloseAvatar} component={Link} to="/me/stories" button>
                          <FormattedMessage
                            id="stories"
                            defaultMessage="Stories"
                          />
                        </ListItem>
                        <Divider />
                        <ListItem onClick={this.handleCloseAvatar} button component={Link} to="/me/publications">
                          <FormattedMessage
                            id="publications"
                            defaultMessage="Publications"
                          />
                        </ListItem>
                        {userCan(user, 'all') && (
                        <>
                          <Divider />
                          <ListItem component={Link} to="/me/users" onClick={this.handleCloseAvatar} button>
                            Users
                          </ListItem>
                          <ListItem component={Link} to="/me/topics" onClick={this.handleCloseAvatar} button>
                            Topics
                          </ListItem>
                        </>
                        )}
                        <Divider />
                        <ListItem component={Link} to={`/@${user.username}`} onClick={this.handleCloseAvatar} button>
                          <FormattedMessage
                            id="profile"
                            defaultMessage="Profile"
                          />
                        </ListItem>
                        <ListItem component={Link} to="/me/settings" onClick={this.handleCloseAvatar} button>
                          <FormattedMessage
                            id="settings"
                            defaultMessage="Settings"
                          />
                        </ListItem>
                        <ListItem onClick={this.handleLogout} button>
                          <FormattedMessage
                            id="signOut"
                            defaultMessage="Sign out"
                          />
                        </ListItem>
                      </List>
                      {/* <div className={classes.popoverArrow} /> */}
                    </Menu>
                  </React.Fragment>
                )}
              </Toolbar>
              {isEditPostPage && (
                <Hidden smUp>
                  <Toolbar className={classes.toolbar}>
                    <HeaderUser location={location} history={history} loading={loading} />
                  </Toolbar>
                </Hidden>
              )}
            </Container>
          </AppBar>
        </RootRef>
        {topics && Array.isArray(topics) && (
          <Container size="publicationSize">
            <div className={classes.metaBar}>
              <nav className={classes.navTopics}>
                <Tabs
                  variant="scrollable"
                  scrollButtons="on"
                  classes={{
                    scrollButtons: classes.scrollButtons,
                    root: classes.tabsRoot,
                    indicator: classes.tabsIndicator,
                    scroller: classes.tabsScroller,
                    flexContainer: classes.tabsFlexContainer
                  }}
                >

                  {topics.map(topic => (
                    <Tab
                      key={topic.slug}
                      component={Link}
                      to={`/${intl.locale === 'en' ? 'topic' : 'tema'}/${topic.slug}`}
                      disableRipple
                      classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                      label={topic.name}
                    />
                  ))}
                  {/* <Link className={classes.topicNavLink} to="/topics">More</Link> */}
                </Tabs>
              </nav>
            </div>
          </Container>
        )}

        <div
          className={classNames(classes.headerContainerBackground, {
            [classes.headerLarge]: size === 'l',
            [classes.headerMedium]: size === 'm',
            [classes.headerSmall]: size === 's',
            [classes[`align${align}`]]: align
          })}
        >
          <div style={styleBg} className={classes.headerContainerBackgroundBg}>
            {backgroundImage.src && <div className={classes.overlayBackground} />}
            <Container size={publication ? 'publicationSize' : 'normal'} className={classes.containerAfterOverlay}>
              <header>
                <div className={classes.headerHero}>
                  {size !== 's'
                    && layout !== 'title'
                    && !!headerLogo && (
                    <div className={classNames({ [classes[`logoContainer${layout}`]]: layout })}>{headerLogo}</div>
                  )}
                  {!!title
                    && layout !== 'logo' && (
                    <Typography
                      style={contrastText}
                      className={classNames({ [classes.textWhite]: !!backgroundImage.src })}
                      variant="h1"
                    >
                      {title}
                    </Typography>
                  )}
                  {size !== 's'
                    && layout !== 'logo'
                    && !!tagline && (
                    <Typography
                      style={contrastText}
                      className={classNames(classes.tagline, { [classes.textWhite]: !!backgroundImage.src })}
                      variant="h2"
                    >
                      {tagline}
                    </Typography>
                  )}
                </div>
              </header>
            </Container>
          </div>
          <div className={classes.headerBackgroundAspectRatioCell}>
            <div className={classes.headerBackgroundAspectRatioFullWith} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withLocale(withRouter(withStyles(styles, { name: 'HeaderApp' })(HeaderApp)));
