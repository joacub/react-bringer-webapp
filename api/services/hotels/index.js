import feathersSequelize from 'feathers-sequelize';
import { Hotels } from 'database/Models';
import hooks from './hooks';

export default app => {
  const options = {
    Model: Hotels,
    paginate: {
      default: 5,
      max: 25
    },
    id: 'id'
  };

  app.use('/hotels', feathersSequelize(options));
  app.service('hotels').hooks(hooks);
};
