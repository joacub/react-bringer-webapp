import errors from '@feathersjs/errors';
import { createAsyncValidator as validator } from 'utils/validation';

export default function validateHook(schema) {
  return async hook => {
    try {
      const extraData = hook.data && hook.data.verifyChanges ? hook.data.verifyChanges : {};
      await validator(schema, { hook })({ ...hook.data, ...extraData });
      return hook;
    } catch (errorsValidation) {
      if (Object.keys(errorsValidation).length) {
        throw new errors.BadRequest('Validation failed', errorsValidation);
      }
    }
  };
}
