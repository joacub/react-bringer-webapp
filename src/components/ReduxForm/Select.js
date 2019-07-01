import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: '1px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect({
  input: {
    name, onChange, value, ...restInput
  },
  inputInput,
  meta,
  helperText,
  options,
  ...rest
}) {
  const classes = useStyles();
  const [_value, setValue] = React.useState(value);

  function handleChange(event) {
    setValue(event.target.value);
    onChange(event.target.value);
  }

  return (
    <FormControl fullWidth className={classes.formControl}>
      <InputLabel htmlFor={name}>{restInput.label}</InputLabel>
      <Select
        fullWidth
        value={_value}
        onChange={handleChange}
        inputProps={{
          name,
          id: name,
        }}
      >
        {options && options.map(opt => <MenuItem value={opt.value}>{opt.label}</MenuItem>)}
      </Select>
      {meta.touched && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
}
