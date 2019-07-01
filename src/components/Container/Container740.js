import React from 'react';
import Proptypes from 'prop-types';
import Grid from '@material-ui/core/Grid/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'clsx';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.common.white,
    maxWidth: 700,
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

@withStyles(styles, { name: 'WMContainer740' })
export default class Container extends React.Component {
  static propTypes = {
    children: Proptypes.node.isRequired,
    className: Proptypes.string, // eslint-disable-line
    classes: Proptypes.objectOf(Proptypes.any).isRequired
  };

  render() {
    const { children, classes, className } = this.props;
    return (
      <Grid container justify="center" alignItems="center" className={classNames(classes.container, className)}>
        {children}
      </Grid>
    );
  }
}
