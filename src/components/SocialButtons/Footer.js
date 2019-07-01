import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import LazyLoad from 'components/LazyLoad/LazyLoad';
import logo from 'components/Img/logo-symbol.svg';

const styles = {
  leftIcon: {
    marginRight: 10,
    fontSize: 20
  },
  facebook: {},
  twitter: {},
  mailicon: {},
  button: {
    margin: 5,
    textTransform: 'none',
    '&:hover': {
      '& $facebook': {
        color: '#4267b2'
      },
      '& $twitter': {
        color: '#00aced'
      }
    }
  },
  container: {
    textAlign: 'center',
    padding: 20
  },
  imgResponsive: {
    width: '100%',
    maxWidth: 120
  },
  imgResponsiveAppDownload: {
    maxWidth: '100%',
    width: 200
  },
  iconMargin: {
    marginRight: 10
  }
};

@withStyles(styles, { name: 'WMComponentFooter' })
export default class FooterComponent extends Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid
        className={classes.container}
        container
        justify="center"
        alignItems="center"
        alignContent="center"
        spacing={3}
      >
        <Grid item xs={12}>
          <Button className={classes.button} component={Link} to="/">
            Home
          </Button>
          <Button className={classes.button} component={Link} to="/activity">
            Activity
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button className={classes.button} component={Link} to="/privacy-policy">
            Privacy Policy
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Link to="/" title="bringer-test.webmediaprojects.net">
            <LazyLoad offsetHorizontal={300}>
              <img className={classes.imgResponsive} src={logo} alt="bringer-test.webmediaprojects.net" />
            </LazyLoad>
          </Link>
        </Grid>
      </Grid>
    );
  }
}
