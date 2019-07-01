import feathersSequelize from 'feathers-sequelize';
import { UserRoles } from 'database/Models';
import hooks from './hooks';

export default function userRoleService() {
  const app = this;

  const options = {
    Model: UserRoles,
    paginate: {
      default: 5,
      max: 25
    }
  };

  app.use('/users/roles', feathersSequelize(options));

  app.service('users/roles').hooks(hooks);
}
