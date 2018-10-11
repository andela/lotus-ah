
const user = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comment'
    });
    User.hasOne(models.Role, {
      foreignKey: 'roleId',
      as: 'roles'
    });
  };
  return User;
};
export default user;
