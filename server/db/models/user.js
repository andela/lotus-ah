
const user = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    roleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      defaultValue: 2,
      references: {
        model: 'roles',
        key: 'id',
        as: 'roleId'
      }
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    socialId: {
      type: DataTypes.STRING,
    },
    provider: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    favouriteTags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isSuspended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
  },
  {
    tableName: 'users'
  });

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comment'
    });
    User.hasMany(models.Reaction, {
      foreignKey: 'userId',
      as: 'reaction'
    });
    User.hasMany(models.Highlight, {
      foreignKey: 'userId',
      as: 'highlights'
    });
    User.hasOne(models.Role, {
      foreignKey: 'roleId',
      as: 'roles'
    });
    User.hasMany(models.Notification, {
      foreignKey: 'userId',
      as: 'notifications'
    });
    User.hasMany(models.NotificationSubscription, {
      foreignKey: 'userId',
      as: 'subscriptions'
    });
    User.belongsToMany(User, {
      as: 'followers',
      through: models.Follow,
      foreignKey: 'followerId',
    });
    User.belongsToMany(User, {
      as: 'following',
      through: models.Follow,
      foreignKey: 'followinId'
    });
    User.hasMany(models.FavoriteArticle, {
      foreignKey: 'userId',
      as: 'favorites'
    });
    User.hasMany(models.Rating, {
      foreignKey: 'userId',
      as: 'ratings'
    });
  };
  return User;
};
export default user;
