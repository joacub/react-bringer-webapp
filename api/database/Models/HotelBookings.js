module.exports = (sequelize, DataTypes) => {
  const HotelBookings = sequelize.define(
    'HotelBookings',
    {
      status: { type: DataTypes.ENUM('processing', 'paid', 'cancelled'), allowNull: false },
      first_name: { type: DataTypes.STRING(85), allowNull: false },
      last_name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(120), allowNull: false },
      phone: { type: DataTypes.STRING(15), allowNull: false },
      address_line: { type: DataTypes.STRING(255), allowNull: false },
      address_line_2: { type: DataTypes.STRING(85), allowNull: false },
      city: { type: DataTypes.STRING(65), allowNull: false },
      state: { type: DataTypes.STRING(2), allowNull: false },
      zip: { type: DataTypes.STRING(5), allowNull: false },
      cc_number: { type: DataTypes.STRING(120), allowNull: false },
      cc_exp_month: { type: DataTypes.STRING(2), allowNull: false },
      cc_exp_year: { type: DataTypes.STRING(4), allowNull: false },
      price: { type: DataTypes.FLOAT(10, 2), allowNull: false },
      taxes: { type: DataTypes.FLOAT(10, 2), allowNull: false },
      fees: { type: DataTypes.FLOAT(10, 2), allowNull: false },
      total: { type: DataTypes.FLOAT(10, 2), allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'hotel_bookings',
      updatedAt: 'modified',
      createdAt: 'created'
    }
  );

  HotelBookings.associate = models => {
    models.HotelBookings.belongsTo(models.Hotels, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'hotel_id',
        allowNull: false
      }
    });

    models.HotelBookings.belongsTo(models.HotelRooms, {
      onDelete: 'CASCADE',
      foreignKey: {
        name: 'room_id',
        allowNull: false
      }
    });
  };

  return HotelBookings;
};
