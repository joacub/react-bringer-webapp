import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/Form/FormControl';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import withStyles from '@material-ui/core/styles/withStyles';

const stylesSelect = {
  select: {
    '&:focus': {
      // Show that it's not an text input
      background: 'none',
      borderRadius: 0 // Reset Chrome style
    },
    // Remove Firefox focus border
    '&:-moz-focusring': {
      color: 'transparent',
      textShadow: '0 0 0 #000'
    },
    // Remove IE11 arrow
    '&::-ms-expand': {
      display: 'none'
    }
  },
  icon: {
    right: 10
  }
};

const styles = theme => ({
  containerFormController: {
    alignItems: 'center',
    display: 'flex',
    flex: 1
  },
  formController: {
    alignItems: 'center',
    display: 'flex',
    flex: 3
  },
  formControllerSelect: {
    textAlign: 'center',
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    borderLeft: '1px solid #cbcbcb',
    borderRight: '1px solid #cbcbcb'
  },
  containerSuggest: {
    display: 'flex',
    flex: 2,
    position: 'relative',
    height: 40
  },
  container: {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    height: 40,
    alignItems: 'center',
    background: '#e0e0e0',
    '&:hover': {
      background: '#fff',
      boxShadow: '0 1px 2px -1px rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)'
    },
    alignSelf: 'center',
    borderRadius: 2,
    paddingLeft: 10,
    paddingRight: 10
  },
  focus: {
    background: '#fff',
    boxShadow: '0 1px 2px -1px rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)'
  },
  searchButton: {
    width: 30
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    left: 0,
    right: 0,
    top: 40
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  textField: {
    width: '100%',
    alignItems: 'center',
    paddingRight: 10
  }
});

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          const result = part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
          return result;
        })}
      </div>
    </MenuItem>
  );
};

const renderSuggestionsContainer = options => {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};

const getSuggestionValue = suggestion => suggestion.label;

const renderInput = inputProps => {
  const {
    categoryValue, classes, autoFocus, value, ref, onChangeCategory, onFocus, onBlur, ...other
  } = inputProps;

  return (
    <div className={classes.containerFormController}>
      <FormControl className={classes.formController}>
        <Input
          autoFocus={autoFocus}
          className={classes.textField}
          value={value}
          inputRef={ref}
          disableUnderline
          {...other}
          type="search"
        />
      </FormControl>
      <FormControl className={classes.formControllerSelect}>
        <SelectWithStyles
          onChange={onChangeCategory}
          onFocus={onFocus}
          onBlur={onBlur}
          fullWidth
          displayEmpty
          disableUnderline
          value={categoryValue}
          input={<Input name="category" id="category-search" />}
        >
          <MenuItem value="">
            <em>All Categories</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </SelectWithStyles>
      </FormControl>
      <IconButton>
        <SearchIcon />
      </IconButton>
    </div>
  );
};

class AutoComplete extends React.Component {
  state = {
    category: '',
    value: '',
    suggestions: [],
    focus: false
  };

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
      ? []
      : this.props.suggestions.filter(suggestion => {
        const keep = count < 5 && suggestion.label.toLowerCase().slice(0, inputLength) === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  handleChangeCategory = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  focus = () => {
    this.setState({
      focus: true
    });
  };

  blur = () => {
    this.setState({
      focus: false
    });
  };

  render() {
    const { classes } = this.props;

    const containerClass = this.state.focus ? classes.focus : 'no-focus';

    return (
      <div className={classes.containerSuggest}>
        <Autosuggest
          theme={{
            container: [classes.container, containerClass].join(' '),
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion
          }}
          renderInputComponent={renderInput}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={{
            autoFocus: true,
            classes,
            placeholder: 'Search one product',
            value: this.state.value,
            onChange: this.handleChange,
            onFocus: this.focus,
            onBlur: this.blur,
            onChangeCategory: this.handleChangeCategory,
            categoryValue: this.state.category
          }}
        />
      </div>
    );
  }
}

AutoComplete.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.any).isRequired
};

const SelectWithStyles = withStyles(stylesSelect, { name: 'AutoComplete' })(Select);

export default withStyles(styles)(AutoComplete);
