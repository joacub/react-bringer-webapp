module.exports = (sequelize, DataTypes) => {
  const Hotels = sequelize.define(
    'Hotels',
    {
      name: { type: DataTypes.STRING(165), allowNull: false },
      rating: { type: DataTypes.INTEGER(1), allowNull: false, defaultValue: 0 },
      address: { type: DataTypes.STRING(165), allowNull: false },
      city: { type: DataTypes.STRING(65), allowNull: false },
      state: { type: DataTypes.STRING(5), allowNull: false },
      zip: { type: DataTypes.STRING(5), allowNull: false },
      country: { type: DataTypes.STRING(65), allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'hotels',
      updatedAt: 'modified',
      createdAt: 'created'
    }
  );

  return Hotels;
};
