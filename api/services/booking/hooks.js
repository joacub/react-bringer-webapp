import {
  disallow,
  fastJoin
} from 'feathers-hooks-common';
import errors from '@feathersjs/errors';
import { Sequelize, HotelRooms, Hotels } from 'database/Models';

const onCreate = async hook => {
  const hotelModel = await Hotels.findByPk(hook.data.hotel_id);
  if (!hotelModel) {
    throw new errors.Conflict('Hotel not Exist');
  }

  const roomModel = await HotelRooms.findByPk(hook.data.room_id);

  if (!roomModel) {
    throw new errors.Conflict('Room Hotel not Exist');
  }

  hook.roomModel = roomModel;

  hook.data.price = roomModel.price;
  hook.data.taxes = roomModel.price * 0.14;
  hook.data.fees = 0;
  hook.data.total = roomModel.price * 1.14;
  hook.data.status = 'processing';
  return hook;
};

const afterCreate = async hook => {
  if (hook.result) {
    await hook.roomModel.update({ status: 'On Request' });
  }

  return hook;
};

const hotelsHooks = {
  before: {
    find: [disallow()],
    get: [disallow()],
    create: [onCreate],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [afterCreate],
    update: [],
    patch: [],
    remove: []
  }
};

export default hotelsHooks;
