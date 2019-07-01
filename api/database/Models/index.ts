import { Model, Sequelize, Table, Column } from 'sequelize-typescript';

@Table
export class User extends Model<User> {

}

@Table
export class UserRoles extends Model<UserRoles> {

}

@Table
export class Images extends Model<Images> {

}

@Table
export class Hotels extends Model<Hotels> {

}

@Table
export class HotelRooms extends Model<HotelRooms> {

}

@Table
export class HotelBookings extends Model<HotelBookings> {

}



export { Sequelize } from 'sequelize-typescript';

export const sequelize = new Sequelize({
  database: 'some_db',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: ':memory:',
  modelPaths: [__dirname + '/models']
});