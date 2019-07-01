import React from 'react';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/SearchOutlined';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import classNames from 'clsx';
import Hidden from '@material-ui/core/Hidden';
import { Link } from 'react-router-dom';
import withLocale from 'hoc/withLocale';

const styles = theme => ({
  inputHaveContent: {},
  root: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    // marginRight: theme.spacing(3),
    marginLeft: theme.spacing(1),
    borderRadius: 2,
    background: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      cursor: 'inherit',
      background: fade(theme.palette.common.white, 0.25)
    },
    '& $inputInput': {
      cursor: 'pointer',
      transition: theme.transitions.create('width'),
      width: 0,
      '&:focus': {
        cursor: 'inherit',
        width: 220
      },
      '&$inputHaveContent': {
        cursor: 'inherit',
        width: 220
      }
    }
  },
  searchIcon: {
    marginRight: theme.spacing(1)
  },
  search: {
    width: theme.spacing(3),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit'
  },
  inputInput: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(3)}px`,
    fontSize: 16
  },
  linkSearc: {
    display: 'flex',
    lineHeight: 1,
  }
});

class Search extends React.PureComponent {
  input = null;

  state = {
    inputHaveContent: false
  };

  onKeyUp = event => {
    // if (event.target.value) {
    //   this.input.value = event.target.value.replace(/ /g, '');
    // }
    this.setState({ inputHaveContent: event.target.value !== '' });
  };

  handleKeyDown = event => {
    const { history } = this.props;
    if (event.key === 'Enter') {
      history.push(`/search?q=${encodeURIComponent(event.target.value)}`);
    } else if (
      ['/', 's'].indexOf(event.key) !== -1
      && document.activeElement.nodeName.toLowerCase() === 'body'
      && document.activeElement !== this.input
    ) {
      event.preventDefault();
      this.input.focus();
    }
  };

  render() {
    const {
      classes,
      placeholder,
      localeContext: { intl }
    } = this.props;

    const { inputHaveContent } = this.state;

    const props = !placeholder
      ? {
        placeholder: intl.formatMessage({
          id: 'searchInBringer',
          defaultMesssage: 'Search in web mediums'
        })
      }
      : { placeholder };
    const inputClassname = classNames(classes.inputInput, { [classes.inputHaveContent]: inputHaveContent });
    return (
      <div className={`${classes.root}`}>
        <Hidden only={['xs', 'sm']} implementation="css">
          <div className={classes.search}>
            <SearchIcon className={classes.searchIcon} />
          </div>
          <Input
            type="search"
            disableUnderline
            onKeyDown={this.handleKeyDown}
            onKeyUp={this.onKeyUp}
            id="docsearch-input"
            ref={node => {
              this.input = node;
            }}
            classes={{
              root: classes.inputRoot,
              input: inputClassname
            }}
            {...props}
          />
        </Hidden>
        <Hidden only={['md', 'lg', 'xl']} implementation="css">
          <Link className={classes.linkSearc} to="/search">
            <SearchIcon className={classes.searchIcon} />
          </Link>
        </Hidden>
      </div>
    );
  }
}

Search.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  placeholder: PropTypes.bool,
  localeContext: PropTypes.objectOf(PropTypes.any).isRequired
};

Search.defaultProps = {
  placeholder: false
};

export default withRouter(withLocale(withStyles(styles, { name: 'WMPComponentSearch' })(Search)));
