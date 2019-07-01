import formatSlug from 'slug';
import generate from 'nanoid/generate';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const shortid = () => generate(alphabet, 12);

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        set(val) {
          this.setDataValue('username', formatSlug(val));
        }
      },
      name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
      bio: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
      email: { type: DataTypes.STRING, unique: true, allowNull: true },
      password: `${DataTypes.STRING(255)} CHARSET utf8 COLLATE utf8_bin`,
      facebookId: { type: DataTypes.STRING },
      facebook: { type: DataTypes.JSON },
      facebookExtraData: { type: DataTypes.JSON },
      twitterId: { type: DataTypes.STRING },
      twitter: { type: DataTypes.JSON },
      twitterExtraData: { type: DataTypes.JSON },
      isEnabled: { type: DataTypes.BOOLEAN, defaultValue: true },
      isVerified: { type: DataTypes.BOOLEAN },
      verifyToken: { type: DataTypes.STRING },
      verifyExpires: { type: DataTypes.DATE }, // or a long integer
      verifyChanges: { type: DataTypes.JSON }, // an object (key-value map), e.g. { field: "value" }
      resetToken: { type: DataTypes.STRING },
      resetExpires: { type: DataTypes.DATE },
      invalidTokensBeforeAt: { type: DataTypes.DATE },
      followersCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      uid: {
        type: `${DataTypes.STRING(12)} CHARSET utf8 COLLATE utf8_general_ci`,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        unique: true,
        allowNull: false,
        defaultValue: shortid
      } // or a long integer
    },
    {
      freezeTableName: true
    }
  );

  User.associate = models => {
    models.User.belongsTo(models.UserRoles, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
    models.User.avatar = models.User.belongsTo(models.Images, {
      as: 'avatar',
      onDelete: 'SET NULL',
      foreignKey: {
        allowNull: true
      }
    });
  };

  return User;
};
