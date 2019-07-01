import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import TextField from 'components/ReduxForm/TextField';
import SelectField from 'components/ReduxForm/Select';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import bookingValidation from './bookingValidation';

const styles = {
  buttonLogin: {
    marginBottom: 10
  },
  containerError: {
    marginTop: 10
  }
};


@withStyles(styles, { name: 'WMBookingForm' })
export default class BookingForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  submit() {
    this.formRef.current.dispatchEvent(new Event('submit'));
  }

  render() {
    const { onSubmit, classes, initialValues } = this.props;

    const currentDate = new Date();

    let currentYear = currentDate.getUTCFullYear();
    const years = [{
      label: currentYear,
      value: currentYear,
    }];
    const lastYear = currentYear + 20;
    while (currentYear < lastYear) {
      currentYear += 1;
      years.push({
        label: currentYear,
        value: currentYear,
      });
    }

    return (
      <Form
        initialValues={initialValues}
        onSubmit={values => onSubmit(values).then(() => {}, err => err)}
        validate={bookingValidation}
        render={({ handleSubmit, submitError, submitting }) => (
          <form ref={this.formRef} method="post" onSubmit={handleSubmit}>
            <Field fullWidth name="hotel_id" type="hidden" component="input" label="Hotel id" />
            <Field fullWidth name="room_id" type="hidden" component="input" label="Room id" />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Field fullWidth name="first_name" type="text" component={TextField} label="Firs Name" />
              </Grid>
              <Grid item xs={6}>
                <Field fullWidth name="last_name" type="text" component={TextField} label="Last Name" />
              </Grid>
              <Grid item xs={8}>
                <Field
                  fullWidth
                  name="email"
                  type="email"
                  component={TextField}
                  label="Email"
                />
              </Grid>
              <Grid item xs={4}>
                <Field
                  fullWidth
                  name="phone"
                  type="phone"
                  component={TextField}
                  label="Phone"
                />
              </Grid>
              <Grid item xs={8}>
                <Field
                  fullWidth
                  name="address_line"
                  type="text"
                  component={TextField}
                  label="Address"
                />
              </Grid>
              <Grid item xs={4}>
                <Field
                  fullWidth
                  name="address_line_2"
                  type="text"
                  component={TextField}
                  label="Address 2"
                />
              </Grid>

              <Grid item xs={6}>
                <Field
                  fullWidth
                  name="city"
                  type="text"
                  component={TextField}
                  label="City"
                />
              </Grid>
              <Grid item xs={4}>
                <Field
                  fullWidth
                  name="state"
                  type="text"
                  component={TextField}
                  label="State"
                />
              </Grid>
              <Grid item xs={2}>
                <Field
                  fullWidth
                  name="zip"
                  type="text"
                  component={TextField}
                  label="Zip"
                />
              </Grid>
              <Grid item xs={6}>
                <Field
                  fullWidth
                  name="cc_number"
                  type="text"
                  component={TextField}
                  label="Credit Card Number"
                />
              </Grid>
              <Grid item xs={4}>
                <Field
                  fullWidth
                  name="cc_exp_month"
                  type="text"
                  component={SelectField}
                  options={[
                    {
                      label: '01 JAN',
                      value: 1
                    },
                    {
                      label: '02 FEB',
                      value: 2
                    },
                    {
                      label: '03 MAR',
                      value: 3
                    },
                    {
                      label: '04 APR',
                      value: 4
                    },
                    {
                      label: '05 MAY',
                      value: 5
                    },
                    {
                      label: '06 JUN',
                      value: 6
                    },
                    {
                      label: '07 JUL',
                      value: 7
                    },
                    {
                      label: '08 AUG',
                      value: 8
                    },
                    {
                      label: '09 SEP',
                      value: 9
                    },
                    {
                      label: '10 OCT',
                      value: 10
                    },
                    {
                      label: '11 NOv',
                      value: 1
                    },
                    {
                      label: '12 DEC',
                      value: 12
                    },
                  ]}
                  label="Exp Month"
                />
              </Grid>
              <Grid item xs={2}>
                <Field
                  fullWidth
                  name="cc_exp_year"
                  type="text"
                  component={SelectField}
                  options={years}
                  label="Exp Year"
                />
              </Grid>
              <Grid item xs={12}>
                {submitting && <LinearProgress color="secondary" />}
                {submitError && (
                  <Typography className={classes.containerError} color="error">
                    {submitError}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}

BookingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired
};

BookingForm.defaultProps = {
  initialValues: {}
};
