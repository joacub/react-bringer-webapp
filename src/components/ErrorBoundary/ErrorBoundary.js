import React from 'react';
import ReactGA from 'react-ga';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import NotFound from 'containers/NotFound/Loadable';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, location: props.location };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location: prevLocation } = prevState;

    if (prevState.hasError && nextProps.location !== prevLocation) {
      return {
        hasError: false,
        location: nextProps.location
      };
    }


    return {
      location: nextProps.location
    };
  }

  clearError = e => {
    e.preventDefault();
    const { history } = this.props;
    history.push(`${window.location.pathname}?redirect_for_error=1`);
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: false });

    if (process.env.NODE_ENV !== 'production') {
      console.info(error);
      console.info(info);
    } else {
      const { location = {} } = this.props;
      ReactGA.exception({
        description: `${error.toString()} => ${location.pathname}`,
        fatal: true
      });
    }
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <React.Fragment>
          <Typography align="center" component="div">
            <br />
            <br />
            <Button
              onClick={this.clearError}
              variant="outlined"
              size="large"
              color="secondary"
              component="a"
              href="/?redirect_for_error=1"
            >
Reload page
            </Button>
          </Typography>
          <NotFound error={{ code: 500 }} />
          <Typography align="center" component="div">
            <Button
              variant="outlined"
              size="large"
              color="secondary"
              component="a"
              href="/?redirect_for_error=1"
              onClick={this.clearError}
            >
Try to reload the page for clean the error
            </Button>
          </Typography>
        </React.Fragment>
      );
    }
    return this.props.children;
  }
}
