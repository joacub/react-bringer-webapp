import feathersSequelize from 'feathers-sequelize';
import { User } from 'database/Models';
import userRole from './roles';
import hooks from './hooks';

export default app => {
  const options = {
    Model: User,
    paginate: {
      default: 5,
      max: 25
    },
    id: 'uid'
  };

  app.use('/users', feathersSequelize(options));
  app.service('users').hooks(hooks);
  app.configure(userRole);
};
