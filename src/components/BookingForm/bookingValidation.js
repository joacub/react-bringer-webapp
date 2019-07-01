import memoize from 'lru-memoize';
import {
  createValidator, required, email, maxLength, minLength
} from 'utils/validation';

const registerValidation = createValidator({
  first_name: [required],
  last_name: [required],
  email: [required, email],
  phone: [required, maxLength(15)],
  address_line: [required, maxLength(255)],
  city: [required, maxLength(65)],
  state: [required, maxLength(2)],
  zip: [required, maxLength(5), minLength(5)],
  cc_number: [required, minLength(20), maxLength(20)],
  cc_exp_month: required,
  cc_exp_year: required,
});
export default memoize(10)(registerValidation);
