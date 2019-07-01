import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

const styles = {
  popper: {
    zIndex: 1200,
    overflowY: 'visible',
    overflowX: 'visible',
    maxHeight: 'calc(100% - 82px)',
    '&[x-placement*="bottom"] $arrow': {
      top: -7,
      left: 0,
      marginTop: '-0.9em',
      '&::before': {
        '-webkit-transform-style': 'rotate(45deg) translate(6px,6px)',
        transform: 'rotate(45deg) translate(6px,6px)',
        '-webkit-box-shadow': '-1px -1px 1px -1px rgba(0,0,0,.54)',
        boxShadow: '-1px -1px 1px -1px rgba(0,0,0,.54)'
      }
    },
    '&[x-placement*="top"] $arrow': {
      bottom: -7,
      left: 0,
      marginBottom: '-0.9em',
      '&::before': {
        '-webkit-transform-style': 'rotate(45deg) translate(-6px, -6px)',
        transform: 'rotate(45deg) translate(-6px, -6px)',
        '-webkit-box-shadow': 'rgba(0, 0, 0, 0.54) 1px 1px 1px -1px',
        boxShadow: 'rgba(0, 0, 0, 0.54) 1px 1px 1px -1px'
      }
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.9em',
      '&::before': {
        borderWidth: '1em 1em 1em 0',
        borderColor: 'transparent #fff transparent transparent'
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.9em',
      '&::before': {
        borderWidth: '1em 0 1em 1em',
        borderColor: 'transparent transparent transparent #fff'
      }
    }
  },
  arrow: {
    position: 'absolute',
    fontSize: 7,
    clip: 'rect(0 18px 14px -4px)',
    '&::before': {
      content: '""',
      display: 'block',
      width: 14,
      height: 14,
      background: '#fff'
    }
  }
};

const offsetTopModifier = (top = 5, leftMargin = 5) => data => {
  if (data.placement === 'top') {
    data.styles.top += top;
    data.styles.left += leftMargin;
  } else {
    data.styles.top += -top;
    data.styles.left += leftMargin;
  }

  return data;
};

@withStyles(styles, { name: 'WMMenu' })
export default class Menu extends Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired,
    margin: PropTypes.number,
    leftMargin: PropTypes.number,
    disablePortal: PropTypes.bool,
    handleClosePopover: PropTypes.func.isRequired,
    keepMounted: PropTypes.bool,
    anchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    children: PropTypes.node.isRequired
  };

  state = {
    arrowRef: null
  };

  static defaultProps = {
    anchorEl: null,
    keepMounted: false,
    margin: 0,
    leftMargin: 0,
    disablePortal: false
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node
    });
  };

  render() {
    const {
      classes, keepMounted, anchorEl, handleClosePopover, children, margin, leftMargin, disablePortal
    } = this.props;

    const { arrowRef } = this.state;

    return (
      <Popper
        keepMounted={keepMounted}
        className={classes.popper}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        transition
        disablePortal={disablePortal}
        preventOverflow={{
          enabled: true,
          boundariesElement: 'scrollParent'
        }}
        modifiers={{
          offset: {
            enabled: true,
            order: 900,
            fn: offsetTopModifier(margin, leftMargin)
          },
          arrow: {
            enabled: Boolean(arrowRef),
            element: arrowRef
          }
        }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper elevation={1}>
              <ClickAwayListener onClickAway={handleClosePopover}>
                <div>{children}</div>
              </ClickAwayListener>
              <span className={classes.arrow} ref={this.handleArrowRef} />
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  }
}
