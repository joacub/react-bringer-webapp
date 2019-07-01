import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import TextField from 'components/ReduxForm/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FaSignInAlt as RegisterIcon } from 'react-icons/fa';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import registerValidation from './registerValidation';

const styles = {
  buttonLogin: {
    marginBottom: 10
  },
  containerError: {
    marginTop: 10
  }
};

@withStyles(styles, { name: 'WMRegisterForm' })
export default class RegisterForm extends Component {
  render() {
    const { onSubmit, classes, initialValues } = this.props;

    return (
      <Form
        initialValues={initialValues}
        onSubmit={values => onSubmit(values).then(() => {}, err => err)}
        validate={registerValidation}
        render={({ handleSubmit, submitError, submitting }) => (
          <form method="post" onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Field fullWidth name="email" type="text" component={TextField} label="Email" />
              </Grid>
              <Grid item xs={12}>
                <Field fullWidth name="password" type="password" component={TextField} label="Password" />
              </Grid>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  name="password_confirmation"
                  type="password"
                  component={TextField}
                  label="Password confirmation"
                />
                {submitError && (
                  <Typography className={classes.containerError} color="error">
                    {submitError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {submitting && <LinearProgress color="secondary" />}
                <Button className={classes.buttonLogin} variant="outlined" fullWidth color="primary" type="submit">
                  <RegisterIcon style={{ marginRight: 10 }} />
                  {' '}
Register
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}

RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

RegisterForm.defaultProps = {
  initialValues: {}
};
