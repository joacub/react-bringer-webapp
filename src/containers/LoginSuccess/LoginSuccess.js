import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as authActions from 'redux/modules/auth';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    textAlign: 'center'
  }),
  button: {
    margin: theme.spacing(1)
  }
});

@withStyles(styles, { name: 'LoginSuccess' })
@connect(
  state => ({ user: state.auth.user }),
  authActions
)
export default class LoginSuccess extends Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    user: PropTypes.shape({
      email: PropTypes.string
    }).isRequired,
    logout: PropTypes.func.isRequired
  };

  render() {
    const { user, logout, classes } = this.props;
    return (
      user && (
        <div>
          <Helmet title="Login Success" />
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={11} md={9}>
              <Paper elevation={4} className={classes.root}>
                <Typography variant="h1" component="h1" paragraph>
                  Hi again and welcome
                </Typography>
                <Typography component="p">
                  Hi,
                  {' '}
                  <strong>{user.email}</strong>
. Welcome back to Bringer, We hope you have a good time with us
                  and have a good read.
                </Typography>
                <br />
                <Button className={classes.button} variant="outlined" color="secondary" component={Link} to="/">
                  Go To Home
                </Button>
                <Button variant="text" color="secondary" component={Link} to={`/@${user.username}`}>
                  Go To My Account
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )
    );
  }
}
