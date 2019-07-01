import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import TextField from 'components/ReduxForm/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { FaSignInAlt as RegisterIcon } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';
import LinearProgress from '@material-ui/core/LinearProgress';
import loginValidation from './loginValidation';

const styles = {
  buttonLogin: {
    marginBottom: 10,
    marginTop: 10
  },
  containerError: {
    marginTop: 10
  }
};

class LoginForm extends PureComponent {
  render() {
    const { onSubmit, classes } = this.props;

    return (
      <Form
        onSubmit={values => onSubmit(values).then(() => {}, err => err)}
        validate={loginValidation}
        render={({ handleSubmit, submitError, submitting }) => (
          <form method="post" onSubmit={handleSubmit}>
            <Grid spacing={1} container>
              <Grid item xs={12}>
                <Field
                  name="email"
                  type="text"
                  fullWidth
                  component={TextField}
                  label={<FormattedMessage id="email" defaultMessage="Email" />}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="password"
                  type="password"
                  fullWidth
                  component={TextField}
                  label={<FormattedMessage id="password" defaultMessage="Password" />}
                />
                {submitError && (
                  <Typography className={classes.containerError} color="error">
                    {submitError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {submitting && <LinearProgress color="secondary" />}
                <Button className={classes.buttonLogin} fullWidth variant="outlined" color="secondary" type="submit">
                  <RegisterIcon style={{ marginRight: 10 }} />
                  <FormattedMessage id="login" defaultMessage="Login" />
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

export default withStyles(styles, { name: 'WMLoginForm' })(LoginForm);
