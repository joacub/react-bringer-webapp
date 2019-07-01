// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

import get from 'lodash.get';
import isEmpty from 'lodash.isempty';
import errors from '@feathersjs/errors';

module.exports = () => hook => {
  if (!hook.params.provider) {
    return Promise.resolve(hook);
  }

  if (get(hook, 'params.user.UserRole.role') === 'admin') {
    return Promise.resolve(hook);
  }

  if (!get(hook, 'params.user') || isEmpty(hook.params.user)) {
    throw new errors.NotAuthenticated('Cannot check if the user is enabled. You must not be authenticated.');
  } else if (!get(hook, 'params.user.isEnabled')) {
    const name = get(hook, 'params.user.name')
      || get(hook, 'params.user.email')
      || get(hook, 'params.user.username')
      || 'This user';

    throw new errors.Forbidden(`${name} is disabled.`);
  }
};
