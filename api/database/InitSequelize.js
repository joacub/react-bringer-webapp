import Sequelize from 'sequelize';
import config from '../config';

const __DEV__ = process.env.NODE_ENV === 'development';
const mysql = __DEV__ ? config.mysqldev : config.mysql;
const sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
  ...mysql.options
});

export { Sequelize };
sequelize.Op = Sequelize.Op;
export default sequelize;
