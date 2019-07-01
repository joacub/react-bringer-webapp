import React from 'react';
import classNames from 'clsx';
import Snackbar, { styles as rootStyles } from '@material-ui/core/Snackbar/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/styles';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const styles = theme => {
  return {
    close: {
      width: 35,
      height: 35,
      padding: 0
    },
    notifs: {
      margin: 20
    },
    notifText: {
      top: 0
    },
    snackBarWrapper: {
      lineHeight: 1.4,
      fontSize: 16,
      flexWrap: 'nowrap'
    },
    success: {
      backgroundColor: green[600]
    },
    error: {
      backgroundColor: theme.palette.error.main
    },
    info: {
      backgroundColor: '#fff'
    },
    warning: {
      backgroundColor: amber[700]
    },
    icon: {
      fontSize: 20
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: 20
    },
    message: {
      display: 'flex',
      alignItems: 'center'
    },
    text: {
      border: 0,
      justifyContent: 'center',
      lineHeight: 1.4,
      fontSize: 16,
      letterSpacing: 0,
      color: 'rgba(0,0,0,.84)',
      backgroundColor: 'rgba(255,255,255,.97)',
      padding: '12px 25px',
      boxShadow: '0 1px 1px rgba(0,0,0,.25),0 0 1px rgba(0,0,0,.35)',
      '-webkit-box-shadow': '0 1px 1px rgba(0,0,0,.25),0 0 1px rgba(0,0,0,.35)',
      borderRadius: '0 0 4px 4px',
      '-webkit-border-radius': '0 0 4px 4px'
    },
    textSnackBarMessage: {
      padding: 0
    },
    infoSnackBarMessage: {
      padding: 0,
      color: '#000'
    },
  };
};

@withStyles(styles)
class NotifComponent extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.calculateHeights !== nextProps.calculateHeights;
  }

  render() {
    const { props } = this;
    const { classes } = props;
    const Icon = variantIcon[props.kind];
    const classesSnack = classes[`${props.kind}SnackBarMessage`]
      ? { message: classes[`${props.kind}SnackBarMessage`] }
      : {};

    const transform = props.kind === 'text' ? false : `translateY(${props.position.vertical === 'bottom' ? '-' : ''}${(props.notifIndex * 20) + (props.calculateHeights || 0)}px)`;
    return (
      <Snackbar
        key={`${props.notifId}-snackbaritem`}
        transform={transform}
        open
        anchorOrigin={props.position}
        className={classNames({ [classes.notifs]: props.kind !== 'text', [classes.notifText]: props.kind === 'text' })}
      >
        <SnackbarContent
          className={classNames(classes.snackBarWrapper, classes[props.kind])}
          classes={classesSnack}
          aria-describedby="client-snackbar"
          message={(
            <div className={classes.message}>
              {!!Icon && <Icon className={classNames(classes.icon, classes.iconVariant)} />}
              {props.message}
            </div>
          )}
          action={
            // eslint-disable-next-line
          props.actions ? props.actions
              : props.action
                ? [
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={() => props.handleCloseNotif(props.notifId)}
                  >
                    <CloseIcon fontSize="small" className={classes.icon} />
                  </IconButton>
                ]
                : null
          }
        />
      </Snackbar>
    );
  }
}

export default NotifComponent;
