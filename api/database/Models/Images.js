import generate from 'nanoid/generate';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const shortid = () => generate(alphabet, 12);

module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define(
    'Images',
    {
      md5: { type: DataTypes.STRING(50), allowNull: false },
      format: { type: DataTypes.STRING(10), allowNull: false },
      width: { type: DataTypes.INTEGER, allowNull: false },
      height: { type: DataTypes.INTEGER, allowNull: false },
      size: { type: DataTypes.INTEGER, allowNull: false },
      originalId: { type: DataTypes.STRING(50), allowNull: true },
      data: { type: DataTypes.JSON, allowNull: false },
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

  return Images;
};
