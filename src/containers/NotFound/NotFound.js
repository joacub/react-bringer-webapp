import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import Container from 'components/Container/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router';
import ReactGA from 'react-ga';

const styles = theme => ({
  mainContainer: {
    background: theme.palette.type === 'light' ? theme.palette.white : theme.palette.grey[900],
    marginTop: 60
  },
  containerContent: {
    maxWidth: 1320,
    margin: '0 auto'
  },
  inputSearch: {
    width: '100%',
    fontSize: 60,
    lineHeight: '70px'
  },
  title: {
    fontSize: 202
  },
  subtitle: {
    fontSize: 77,
    color: 'rgba(0,0,0,.3)',
    paddingTop: 70
  },
  textField: {
    width: '100%'
  },
  containerSearch: {
    marginTop: 40,
    marginBottom: 40
  },
  [theme.breakpoints.down('xs')]: {
    inputSearch: {
      fontSize: 24,
      lineHeight: '30px'
    }
  }
});

class NotFound extends Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    error: PropTypes.objectOf(PropTypes.any),
    staticContext: PropTypes.objectOf(PropTypes.any),
    history: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    staticContext: undefined,
    error: {
      code: 404
    }
  };

  state = {
    inputs: {
      q: ''
    }
  };

  componentDidMount() {
    const { error = {} } = this.props;
    const errorCode = parseInt(error.code, 10);
    if (errorCode !== 404) {
      ReactGA.exception({
        description: `${JSON.stringify(errorCode)} => ${window.location}`,
        fatal: true
      });
    }
  }

  handleInput = event => {
    const { target } = event;
    this.setState({
      inputs: { [target.name]: target.value }
    });
  };

  submitHandler = event => {
    event.preventDefault();
    const { history } = this.props;
    const {
      inputs: { q }
    } = this.state;
    // do some sort of verification here if you need to
    history.push(`/search?q=${q}`);
  };

  render() {
    const { classes, staticContext, error } = this.props;
    if (staticContext) {
      staticContext.code = error.code || 404;
    }

    const title = error.code === 404 ? 'Not found - Bringer' : 'Error loading - Bringer';
    const description = error.code === 404 ? 'We couldn’t find this page.' : 'Error loading';

    return (
      <Container size="publicationSize">
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta name="description" content={description} />
        </Helmet>
        <Grid container alignContent="center" justify="center" className={classes.mainContainer}>
          <Grid item xs={12}>
            <Grid container alignContent="center">
              <Grid item xs={12} sm={5}>
                <Typography variant="h1" className={classes.title}>
                  {error.code}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={7}>
                <Typography variant="h2" className={classes.subtitle}>
                  {description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.containerSearch}>
            <form action="/search" onSubmit={this.submitHandler}>
              <Grid container alignContent="center" alignItems="center" spacing={5}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    name="q"
                    onChange={this.handleInput}
                    className={classes.textField}
                    InputProps={{ classes: { input: classes.inputSearch } }}
                    placeholder="Search in Bringer"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button type="submit" variant="outlined" size="large">
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles, { name: 'NotFound' })(NotFound));
