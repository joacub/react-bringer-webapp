import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoginForm from 'components/LoginForm/LoginForm';
import RecoveryPasswordForm from 'components/RecoveryPasswordForm/RecoveryPasswordForm';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';
import { resetPwdLong, sendResetPwd } from 'redux/modules/account/authManagement';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormattedMessage } from 'react-intl';
import withLocale from 'hoc/withLocale';
import { getLink } from 'utils/getLink';
import cookie from 'cookies-js';
import qs from 'qs';

const styles = () => ({
  container: {
    textAlign: 'center',
    marginTop: -64,
    height: '100vh!important'
  },
  card: {
    maxWidth: 345
  },
  typoColor: {
    color: '#fff'
  },
  buttonRegister: {
    marginTop: 10
  },
  facebook: {
    background: '#4267b2',
    border: '1px solid #4267b2',
    color: '#fff',
    '&:hover': {
      color: '#4267b2'
    }
  },
  loginTitle: {
    fontFamily: 'wm-marketing-display-font,Georgia,Cambria,"Times New Roman",Times,serif',
    fontWeight: 500,
    fontSize: 32,
    lineHeight: '36px',
    transform: 'translateY(-2px)',
  },
  buttonFacebook: {
    marginBottom: 10,
    backgroundColor: '#3b5998',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#1d315b'
    },
    '& svg': {
      width: 21,
      height: 21,
      marginRight: 4,
      position: 'relative',
      top: -1
    }
  },
  buttonTwitter: {
    backgroundColor: '#55acee',
    color: '#fff',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#006daa'
    },
    '& svg': {
      width: 21,
      height: 21,
      marginRight: 4,
      position: 'relative',
      top: -1
    }
  },
});
@withRouter
@withLocale
@connect(
  state => ({
    user: state.auth.user,
    verifySignUpResult: state.authManagement && state.authManagement.verifySignUpResult,
    verifySignUpResultError: state.authManagement && state.authManagement.verifySignUpResultError,
    verifyChangesResult: state.authManagement && state.authManagement.verifyChangesResult,
    verifyChangesResultError: state.authManagement && state.authManagement.verifyChangesResultError
  }),
  {
    ...notifActions, ...authActions, resetPwdLongR: resetPwdLong, sendResetPwdR: sendResetPwd
  }
)
class Login extends Component {
  static propTypes = {
    user: PropTypes.shape({
      email: PropTypes.string
    }),
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    resetPwdLongR: PropTypes.func.isRequired,
    sendResetPwdR: PropTypes.func.isRequired,
    verifySignUpResult: PropTypes.objectOf(PropTypes.any),
    verifySignUpResultError: PropTypes.objectOf(PropTypes.any),
    verifyChangesResult: PropTypes.objectOf(PropTypes.any),
    verifyChangesResultError: PropTypes.objectOf(PropTypes.any),
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired,
    localeContext: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  static contextTypes = {
    router: PropTypes.objectOf(PropTypes.any)
  };

  static defaultProps = {
    user: null,
    verifySignUpResult: null,
    verifySignUpResultError: null,
    verifyChangesResult: null,
    verifyChangesResultError: null
  };

  state = {
    recovery: false
  };

  componentDidMount() {
    const {
      verifySignUpResult,
      verifySignUpResultError,
      verifyChangesResult,
      verifyChangesResultError,
      notifSend,
      load,
      location,
      user,
      history
    } = this.props;

    if (location.search.indexOf('redirect') !== -1) {
      cookie.set('redirect', location.search);
    }

    if (user && cookie.get('redirect')) {
      const cquery = cookie.get('redirect');
      try {
        const query = qs.parse(cquery, { ignoreQueryPrefix: true });
        this.successLogin();
        history.push(query.redirect || '/login-success');
      } catch (e) {
        console.error(e);
      }
    }

    if (!verifySignUpResultError && verifySignUpResult) {
      notifSend({
        message: 'Your email has been verified. We can now protect your account and you can login.',
        kind: 'success',
        dismissAfter: 10000
      });
    } else if (verifySignUpResultError) {
      notifSend({
        message: 'Sorry, but we could not verify your email.',
        kind: 'error',
        dismissAfter: 10000
      });
    }

    if (!verifyChangesResultError && verifyChangesResult) {
      load();
      notifSend({
        message: 'You have approved the changes to your account.',
        kind: 'success',
        dismissAfter: 10000
      });
    } else if (verifyChangesResultError) {
      notifSend({
        message: `Sorry, but we could not approved the changes to your account: ${verifyChangesResultError.message || ''}`,
        kind: 'error',
        dismissAfter: 10000
      });
    }
  }

  login = async data => {
    const { login } = this.props;
    const result = await login('local', data);
    this.successLogin();
    return result;
  };

  recovery = async data => {
    const { sendResetPwdR, resetPwdLongR, history } = this.props;
    const result = data.token ? await resetPwdLongR(data.token, data.password) : await sendResetPwdR(data.email);
    const { notifSend } = this.props;
    if (data.token) {
      notifSend({
        message: 'Your password is restored',
        kind: 'success',
        dismissAfter: 10000
      });
      history.push('/login');
    } else {
      notifSend({
        message: 'We send you a email with instructions',
        kind: 'success',
        dismissAfter: 10000
      });
    }

    return result;
  };

  successLogin = () => {
    const { notifSend } = this.props;
    notifSend({
      message: "You're logged !",
      kind: 'success',
      dismissAfter: 10000
    });
  };

  render() {
    const {
      user, logout, classes, localeContext: { intl }, history, location, match: { params }
    } = this.props;

    const { recovery } = this.state;

    let title = intl.formatMessage({ id: 'login', defaultMessage: 'Login' });

    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const isLoadingAuth = query.connect || location.hash.indexOf('access_token=') !== -1;
    if (isLoadingAuth) {
      title = 'Loading session';
    }

    return (
      <Grid container justify="center" alignItems="center" className={`headerBackground ${classes.container}`}>
        <Helmet>
          <title>{title}</title>
          <meta name="title" content={title} />
          <link rel="canonical" href={getLink('/login', false)} />
        </Helmet>
        {(recovery || params.type === 'reset') && (
          <Grid item>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.loginTitle} variant="h1">
                  <FormattedMessage
                    id="recoveryPassword"
                    defaultMessage="Recovery password"
                  />
                </Typography>
                <RecoveryPasswordForm token={params.type === 'reset' && params.slug} onSubmit={this.recovery} />
              </CardContent>
            </Card>
            {params.type !== 'reset' && <Button onClick={() => { this.setState({ recovery: false }); }}>Login</Button>}
          </Grid>
        )}
        {(!recovery && params.type !== 'reset') && (
          <Grid item>
            <Card className={classes.card}>
              <CardContent>
                {!user && !isLoadingAuth && (
                  <Typography className={classes.loginTitle} variant="h1">
                    <FormattedMessage
                      id="login"
                      defaultMessage="Login"
                    />
                  </Typography>
                )
                }
                {!user && !isLoadingAuth && (
                  <div>
                    <LoginForm onSubmit={this.login} />
                    <Button
                      fullWidth
                      className={classes.buttonFacebook}
                      variant="contained"
                      onClick={() => {
                        window.location.href = '/oauth/facebook';
                      }}
                    >
                      <FormattedMessage
                        id="loginWith"
                        defaultMessage="Login with {value}"
                        values={{
                          value: 'Facebook'
                        }}
                      />
                    </Button>
                    <Button
                      fullWidth
                      className={classes.buttonTwitter}
                      variant="contained"
                      onClick={() => {
                        window.location.href = '/oauth/twitter';
                      }}
                    >
                      <FormattedMessage
                        id="loginWith"
                        defaultMessage="Login with {value}"
                        values={{
                          value: 'Twitter'
                        }}
                      />
                    </Button>
                    <Button
                      component={Link}
                      to={`/register${history.location.search}`}
                      className={classes.buttonRegister}
                      fullWidth
                      variant="outlined"
                      color="secondary"
                    >
                      <FormattedMessage
                        id="createAccount"
                        defaultMessage="Create account"
                      />
                    </Button>
                  </div>
                )}
                {isLoadingAuth && (
                <>
                  <Typography paragraph>
                  Connecting with your account...
                  </Typography>
                  <div>
                    <CircularProgress className={classes.progress} />
                  </div>
                </>
                )}
                {user && (
                <>
                  <br />
                  <Typography paragraph>
                  You are currently logged in as
                    {' '}
                    {user.name || user.email}
.
                  </Typography>

                  <div>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={logout}
                    >
                      <FormattedMessage
                        id="signOut"
                        defaultMessage="Sign out"
                      />
                    </Button>
                  </div>
                </>
                )}
              </CardContent>
            </Card>
            <Button onClick={() => { this.setState({ recovery: true }); }}>Recovery password</Button>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withStyles(styles, { name: 'Login' })(Login);
