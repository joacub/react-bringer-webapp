import accountService from 'services/authManagement/notifier';
import config from 'config';

module.exports = () => hook => {
  if (!hook.params.provider) {
    return hook;
  }

  const user = hook.result;

  if (config.email.mail && hook.data && hook.data.email && user) {
    accountService(hook.app).notifier('resendVerifySignup', user);
    return hook;
  }

  return hook;
};
