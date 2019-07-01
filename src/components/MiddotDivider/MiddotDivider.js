import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  middotDivider: {
    paddingRight: '.3em',
    paddingLeft: '.3em',
    '&:after': {
      content: '"\\00B7"'
    }
  }
};
export default withStyles(styles, { name: 'Stories' })(props => <span className={props.classes.middotDivider} />);
