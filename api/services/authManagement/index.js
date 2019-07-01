// Initializes the `authManagement` service on path `/authManagement`
import authManagement from 'feathers-authentication-management';
import hooks from './hooks';
import notifier from './notifier';

module.exports = app => {
  // Initialize our service with any options it requires
  app.configure(authManagement(notifier(app)));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('authManagement');

  // check props are unique in the users items
  service.hooks(hooks);
};
