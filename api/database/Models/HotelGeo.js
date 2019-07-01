module.exports = (sequelize, DataTypes) => {
  const HotelGeo = sequelize.define(
    'HotelGeo',
    {
      lat: { type: DataTypes.STRING(12), allowNull: false },
      long: { type: DataTypes.STRING(12), allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'hotel_geo_locations',
      updatedAt: 'modified',
      createdAt: 'created'
    }
  );

  HotelGeo.associate = models => {
    models.HotelGeo.belongsTo(models.Hotels, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'hotel_id',
        allowNull: false
      }
    });
  };

  return HotelGeo;
};
