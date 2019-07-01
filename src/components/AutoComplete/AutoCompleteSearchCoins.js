import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/Form/FormControl';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  containerSuggest: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    height: 50
  },
  container: {
    display: 'flex',
    flexGrow: 1,
    position: 'relative',
    height: 50,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 2,
    paddingRight: 10
  },
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
  textField: {
    width: '100%',
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 23
  },
  '@media (min-width: 321px) and (max-width: 600px)': {
    textField: {
      fontSize: 19
    }
  },
  '@media (max-width: 320px)': {
    textField: {
      fontSize: 15
    }
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 98,
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
      <SearchIcon />
      <FormControl className={classes.formController}>
        <Input
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          className={classes.textField}
          value={value}
          inputRef={ref}
          disableUnderline
          {...other}
          type="search"
        />
      </FormControl>
    </div>
  );
};

class AutoComplete extends React.Component {
  static defaultProps = {
    onKeyUp: () => {},
    onChange: () => {},
    suggestions: []
  };

  constructor(props) {
    super(props);
    this.state = {
      category: '',
      value: '',
      suggestions: props.suggestions,
      focus: false
    };
  }

  onKeyUp = event => {
    const { onKeyUp } = this.props;
    onKeyUp(event.target.value);
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
    this.props.onChange(newValue);
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
            placeholder: 'Search',
            value: this.state.value,
            onChange: this.handleChange,
            onFocus: this.focus,
            onBlur: this.blur,
            onKeyUp: this.onKeyUp,
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
  suggestions: PropTypes.arrayOf(PropTypes.any).isRequired,
  onKeyUp: PropTypes.func,
  onChange: PropTypes.func
};

export default withStyles(styles)(AutoComplete);
