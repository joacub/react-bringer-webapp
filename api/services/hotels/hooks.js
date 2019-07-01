import {
  disallow,
  fastJoin
} from 'feathers-hooks-common';
import { Sequelize, HotelRooms } from 'database/Models';

const customizeQuery = async hook => {
  if (hook.params.query.$paginate !== undefined) {
    hook.params.paginate = hook.params.query.$paginate === 'false' || hook.params.query.$paginate === false;
    delete hook.params.query.$paginate;
  }

  const attributes = {
    exclude: [],
    include: [
      [Sequelize.literal('(SELECT filename FROM uploads up WHERE up.model = "Hotels" AND up.type = "photo" AND up.foreign_key = Hotels.id)'), 'image'],
      [Sequelize.literal('(SELECT price FROM hotel_rooms hr WHERE hr.hotel_id = Hotels.id ORDER BY hr.price ASC LIMIT 1)'), 'price'],
      [Sequelize.literal('(SELECT CONCAT(lat, "|", lon) FROM hotel_geo_locations geo WHERE geo.hotel_id = Hotels.id LIMIT 1)'), 'geo']
    ]
  };

  hook.params.sequelize = {
    nest: true,
    attributes,
  };

  if (hook.params.query.$sort && hook.params.query.$sort.price) {
    const DIR = hook.params.query.$sort.price === -1 ? 'DESC' : 'ASC';
    hook.params.sequelize.order = [[Sequelize.literal('price'), DIR]];
    delete hook.params.query.$sort.price;
  }
};

const postResolvers = {
  joins: {
    rooms: () => async hotel => {
      hotel.rooms = await HotelRooms.findAll({
        raw: true,
        where: {
          hotel_id: hotel.id
        }
      });
    },
  }
};

const hotelsHooks = {
  before: {
    find: [customizeQuery],
    get: [],
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },
  after: {
    all: [],
    find: [fastJoin(postResolvers)],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

export default hotelsHooks;
