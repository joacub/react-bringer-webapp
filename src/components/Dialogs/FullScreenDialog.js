import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';

const styles = {
  appBar: {
    border: 0,
    position: 'relative',
    background: 'transparent',
    boxShadow: 'none'
  },
  flex: {
    flex: 1
  },
  right: {
    marginLeft: 'auto'
  },
  container: {
    height: '100%',
    marginTop: -64
  },
  paper: {
    background: 'rgba(255,255,255,.97)'
  }
};

class FullScreenDialog extends React.Component {
  render() {
    const {
      classes, open, handleClose, children
    } = this.props;
    return (
      <Dialog classes={{ paperFullScreen: classes.paper }} fullScreen open={open} onClose={this.handleClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton className={classes.right} onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container justify="center" className={classes.container} alignItems="center">
          <Grid item xs={12} sm={6}>
            {children}
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}

FullScreenDialog.defaultProps = {
  open: false
};

FullScreenDialog.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool
};

export default withStyles(styles, { name: 'WMFullScreenDialog' })(FullScreenDialog);
