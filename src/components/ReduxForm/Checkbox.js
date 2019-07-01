/* eslint-disable react/prop-types */
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default ({
  input: {
    name, onChange, value, ...restInput
  },
  inputInput,
  meta,
  label,
  ...rest
}) => (
  <FormControlLabel
    control={(
      <Checkbox
        {...rest}
        name={name}
        error={meta.error && meta.touched}
        inputProps={{ ...inputInput, ...restInput }}
        onChange={onChange}
        value={String(value)}
      />
    )}
    label={label}
  />
);
