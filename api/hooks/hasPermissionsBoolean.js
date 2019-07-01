import get from 'lodash.get';

module.exports = function hasPermissionsBoolean() {
  // const permissions = Array.from(arguments) || [];

  return hook => {
    if (!hook.params.provider) {
      return true;
    }

    if (
      !get(hook, 'params.user.UserRole.role') === 'admin'

    // !get(hook, 'params.user.permissions') ||

    // !permissions.every(p => hook.params.user.permissions.includes(p))
    ) {
      return false;
    }

    return true;
  };
};
