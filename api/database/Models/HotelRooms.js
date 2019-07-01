module.exports = (sequelize, DataTypes) => {
  const HotelRooms = sequelize.define(
    'HotelRooms',
    {
      name: { type: DataTypes.STRING(165), allowNull: false },
      status: { type: DataTypes.ENUM('On Request', 'Available', 'Sold Out'), allowNull: false },
      price: { type: DataTypes.INTEGER(5), allowNull: false },
      has_promos: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'hotel_rooms',
      updatedAt: 'modified',
      createdAt: 'created'
    }
  );

  HotelRooms.associate = models => {
    models.HotelRooms.belongsTo(models.Hotels, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'hotel_id',
        allowNull: false
      }
    });
  };

  return HotelRooms;
};
