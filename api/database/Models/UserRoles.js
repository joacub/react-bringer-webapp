import generate from 'nanoid/generate';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const shortid = () => generate(alphabet, 12);
module.exports = (sequelize, DataTypes) => {
  const UserRoles = sequelize.define(
    'UserRoles',
    {
      role: DataTypes.STRING,
      uid: {
        type: `${DataTypes.STRING(12)} CHARSET utf8 COLLATE utf8_general_ci`,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        unique: true,
        allowNull: false,
        defaultValue: shortid
      }
    },
    {
      freezeTableName: true
    }
  );

  return UserRoles;
};
