import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'clsx';

const styles = {
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  containerPaddingDefault: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  containerPaddingHome: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  containerFull: {
    width: '100%',
    backgroundColor: 'transparent'
  },
  normal: {
    maxWidth: 1120
  },
  publicationSize: {
    maxWidth: 1040
  },
  extremeSize: {
    maxWidth: 1214
  },
  small: {
    maxWidth: 740
  },
  spacing0: {},
  spacing1: {
    padding: 24
  },
  spacing2: {
    padding: 28
  },
  spacing3: {
    padding: 32
  },
  spacing4: {
    padding: 36
  },
  spacing5: {
    padding: 40
  },

  spacingMargin0: {},
  spacingMargin1: {
    margin: -4
  },
  spacingMargin2: {
    margin: -8
  },
  spacingMargin3: {
    margin: -12
  },
  spacingMargin4: {
    margin: -16
  },
  spacingMargin5: {
    margin: -20
  },

  '@media (max-width: 991px)': {
    containerPaddingDefault: {
      paddingLeft: 20,
      paddingRight: 20
    },
    containerPaddingHome: {
      paddingLeft: 16,
      paddingRight: 16,
    },
    spacing1: {
      padding: 4,
      paddingLeft: 24,
      paddingRight: 24
    },
    spacing2: {
      padding: 8,
      paddingLeft: 28,
      paddingRight: 28
    },
    spacing3: {
      padding: 12,
      paddingLeft: 32,
      paddingRight: 32
    },
    spacing4: {
      padding: 16,
      paddingLeft: 36,
      paddingRight: 36
    },
    spacing5: {
      padding: 20,
      paddingLeft: 40,
      paddingRight: 40
    }
  }
};

@withStyles(styles, { name: 'WMContainer' })
export default class Container extends React.Component {
  static propTypes = {
    size: PropTypes.string,
    component: PropTypes.string,
    spacing: PropTypes.number,
    fullWidth: PropTypes.bool,
    children: PropTypes.node.isRequired,
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    className: PropTypes.string // eslint-disable-line
  };

  static defaultProps = {
    fullWidth: false,
    size: 'normal',
    spacing: 0,
    component: 'div',
    padding: 'Default'
  };

  render() {
    const {
      children, classes, className, padding, fullWidth, size, spacing, component: Component, ...otherProps
    } = this.props;

    return (
      <Component
        className={classNames(
          {
            [classes.container]: !fullWidth,
            [classes[size]]: !fullWidth && classes[size],
            [classes.containerFull]: fullWidth,
            [classes[`containerPadding${padding}`]]: !fullWidth
          },
          className,
          // classes[`spacing${spacing}`]
        )}
        {...otherProps}
      >
        {children}
        {/* {spacing === 0 ? children : <div className={classes[`spacingMargin${spacing}`]}>{children}</div>} */}
      </Component>
    );
  }
}
