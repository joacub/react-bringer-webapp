import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent/CardContent';
import Typography from '@material-ui/core/Typography';
import RegisterForm from 'components/RegisterForm/RegisterForm';
import { withRouter } from 'react-router';
import * as authActions from 'redux/modules/auth';
import * as notifActions from 'redux/modules/notifs';
import { getLink } from 'utils/getLink';

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
  buttonLogin: {
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
  registerTitle: {
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

@connect(
  () => ({}),
  { ...notifActions, ...authActions }
)
@withRouter
class Register extends Component {
  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.object
    }).isRequired,
    register: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired
  };

  state = {
    isRegister: false
  };

  onFacebookLogin = async (err, data) => {
    const { login, history } = this.props;

    if (err) {
      return;
    }

    try {
      await login('facebook', data);
      this.successLogin();
    } catch (error) {
      if (error.message === 'Incomplete oauth registration') {
        history.push({
          pathname: '/register',
          state: { oauth: error.data }
        });
      } else {
        throw error;
      }
    }
  };

  successLogin = () => {
    const { notifSend } = this.props;
    notifSend({
      message: "You're logged !",
      kind: 'success',
      dismissAfter: 10000
    });
  };

  FacebookLoginButton = ({ facebookLogin }) => {
    const { classes } = this.props;
    return (
      <Button fullWidth variant="raised" color="primary" className={classes.facebook} onClick={facebookLogin}>
      Register with
        {' '}
        <FacebookIcon style={{ marginLeft: 10 }} />
      </Button>
    );
  };

  getInitialValues = () => {
    const { location } = this.props;
    return location.state && location.state.oauth;
  };

  register = async data => {
    const { register } = this.props;
    const result = await register(data);
    this.setState({ isRegister: true });
    this.successRegister();
    return result;
  };

  successRegister = () => {
    const { notifSend } = this.props;
    notifSend({
      message: "You'r now registered !",
      kind: 'success',
      dismissAfter: 2000
    });
  };

  render() {
    const { classes, history } = this.props;
    const { isRegister } = this.state;
    const title = 'Register';
    return (
      <Grid container justify="center" alignItems="center" className={`headerBackground ${classes.container}`}>
        <Helmet>
          <title>{title}</title>
          <meta name="title" content={title} />
          <link rel="canonical" href={getLink('/register', false)} />
        </Helmet>
        <Card className={classes.card}>
          {!isRegister && (
            <CardContent>
              <Typography className={classes.registerTitle} variant="h1">Register</Typography>
              <RegisterForm onSubmit={this.register} initialValues={this.getInitialValues()} />
              <Button
                fullWidth
                className={classes.buttonFacebook}
                variant="contained"
                onClick={() => {
                  window.location.href = '/oauth/facebook';
                }}
              >
                Register with Facebook
              </Button>
              <Button
                fullWidth
                className={classes.buttonTwitter}
                variant="contained"
                onClick={() => {
                  window.location.href = '/oauth/twitter';
                }}
              >
                Register with Twitter
              </Button>
              <Button
                component={Link}
                to={`/login${history.location.search}`}
                className={classes.buttonLogin}
                fullWidth
                variant="outlined"
                color="secondary"
              >
                  Log in
              </Button>
            </CardContent>
          )}
          {isRegister && (
            <CardContent>
              <Typography gutterBottom variant="h2">You are register</Typography>
              <Typography paragraph variant="body1">We are send you a confirmation email, please verify your identity.</Typography>
              <Button variant="outlined" color="primary" component={Link} to="/login">
                Go To Login
              </Button>
            </CardContent>
          )}
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles, { name: 'Register' })(Register);
