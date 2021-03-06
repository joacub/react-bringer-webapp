import React from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem/ListItem';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
class LeftSideDrawer extends React.Component {
  static propTypes = {
    classes: PropTypes.objectOf(PropTypes.any).isRequired
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <ListItem className={classes.itemLeaf} disableGutters>
          <Button className={classes.buttonLeaf} component={Link} to="/">
            Home
          </Button>
        </ListItem>
        <ListItem className={classes.itemLeaf} disableGutters>
          <Button className={classes.buttonLeaf} component={Link} to="/privacy-policy">
            Privacy Policy
          </Button>
        </ListItem>
      </React.Fragment>
    );
  }
}

export default LeftSideDrawer;
