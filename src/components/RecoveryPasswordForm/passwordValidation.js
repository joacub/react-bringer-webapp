import memoize from 'lru-memoize';
import { createValidator, required } from 'utils/validation';

const passwordValidation = createValidator({
  password: [required],
  token: [required],
});
export default memoize(10)(passwordValidation);
