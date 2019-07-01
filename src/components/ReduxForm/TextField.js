/* eslint-disable react/prop-types */
import React from 'react';
import TextField from '@material-ui/core/TextField';

export default ({
  input: {
    name, onChange, value, ...restInput
  },
  inputInput,
  meta,
  helperText,
  ...rest
}) => (
  <TextField
    {...rest}
    name={name}
    helperText={meta.touched ? meta.error : helperText}
    error={meta.error && meta.touched}
    inputProps={{ ...inputInput, ...restInput }}
    onChange={onChange}
    value={value}
  />
);
