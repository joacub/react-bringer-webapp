import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    marginLeft: 1,
  },
  dotLoad: {
    animationName: '$blink',
    animationDuration: '1.4s',
    animationIterationCount: 'infinite',
    animationFillMode: 'both',
    '&:nth-child(2)': {
      animationDelay: '.2s',
    },
    '&:nth-child(3)': {
      animationDelay: '.4s',
    }
  },
  '@keyframes blink': {
    '0%': {
      opacity: 0.2,
    },
    '20%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0.2
    }
  }
};

@withStyles(styles, { name: 'DotsLoading' })
export default class DotsLoading extends Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  render() {
    const {
      classes,
      ...others
    } = this.props;

    return (
      <span className={classes.container} {...others}>
        <span className={classes.dotLoad}>.</span>
        <span className={classes.dotLoad}>.</span>
        <span className={classes.dotLoad}>.</span>
      </span>
    );
  }
}
