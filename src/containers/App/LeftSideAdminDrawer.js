import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';

const styles = theme => ({
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    justifyContent: 'flex-start',
    textTransform: 'none',
    width: '100%'
  },
  buttonLeaf: {
    justifyContent: 'flex-start',
    textTransform: 'none',
    width: '100%',
    color: theme.palette.text.secondary
  },
  active: {
    color: theme.palette.text.primary
  }
});

@withStyles(styles)
class LeftSideAdminDrawer extends React.Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired
  };

  render() {
    const { classes } = this.props;
    return (
      <ListItem className={classes.itemLeaf} disableGutters>
        <Button className={classes.buttonLeaf} component={Link} to="/admin">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          Admin
        </Button>
      </ListItem>
    );
  }
}

export default LeftSideAdminDrawer;
