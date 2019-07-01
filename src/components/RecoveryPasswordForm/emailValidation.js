import memoize from 'lru-memoize';
import { createValidator, required, email } from 'utils/validation';

const emailValdiation = createValidator({
  email: [email, required],
});
export default memoize(10)(emailValdiation);
