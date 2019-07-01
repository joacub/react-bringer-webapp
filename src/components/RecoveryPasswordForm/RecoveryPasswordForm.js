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
import emailValidation from './emailValidation';
import passwordValidation from './passwordValidation';

const styles = {
  buttonLogin: {
    marginBottom: 10,
    marginTop: 10
  },
  containerError: {
    marginTop: 10
  }
};

class RecoveryPasswordForm extends PureComponent {
  render() {
    const { onSubmit, classes, token } = this.props;

    return (
      <Form
        initialValues={{ token }}
        onSubmit={values => onSubmit(values).then(() => {}, err => err)}
        validate={token ? passwordValidation : emailValidation}
        render={({
          handleSubmit, submitError, validating, submitting, pristine, invalid
        }) => (
          <form method="post" onSubmit={handleSubmit}>
            <Grid spacing={1} container>
              <Grid item xs={12}>
                {!token && (
                  <Field
                    name="email"
                    type="text"
                    fullWidth
                    component={TextField}
                    label={<FormattedMessage id="email" defaultMessage="Email" />}
                  />
                )}
                {!!token && (
                  <>
                    <Field
                      name="password"
                      type="password"
                      fullWidth
                      component={TextField}
                      label={<FormattedMessage id="typeNewPassword" defaultMessage="Type new password" />}
                    />
                    <Field
                      name="token"
                      type="hidden"
                      component={TextField}
                    />
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                {submitError && (
                  <Typography className={classes.containerError} color="error">
                    {submitError}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button disabled={validating || submitting || pristine || invalid} className={classes.buttonLogin} fullWidth variant="outlined" color="secondary" type="submit">
                  <RegisterIcon style={{ marginRight: 10 }} />
                  <FormattedMessage id="Send" defaultMessage="Send" />
                </Button>
                {(validating || submitting) && <LinearProgress color="secondary" />}
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}

RecoveryPasswordForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  token: PropTypes.string,
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};
RecoveryPasswordForm.defaultProps = {
  token: ''
};

export default withStyles(styles, { name: 'WMRecoveryPasswordForm' })(RecoveryPasswordForm);
