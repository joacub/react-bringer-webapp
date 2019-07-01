import feathersSequelize from 'feathers-sequelize';
import { HotelBookings } from 'database/Models';
import hooks from './hooks';

export default app => {
  const options = {
    Model: HotelBookings,
    paginate: {
      default: 5,
      max: 25
    },
    id: 'id'
  };

  app.use('/booking', feathersSequelize(options));
  app.service('booking').hooks(hooks);
};
