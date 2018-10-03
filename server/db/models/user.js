
const user = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    firstname: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
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
    },
    bio: {
      type: DataTypes.TEXT
    },
    favouriteTags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    roleId: {
      type: DataTypes.INTEGER
    },
    isPremium: {
      type: DataTypes.BOOLEAN
    },
    isSuspended: {
      type: DataTypes.BOOLEAN
    },
    imageUrl: {
      type: DataTypes.STRING
    },
    isActivated: {
      type: DataTypes.BOOLEAN
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
  return User;
};
export default user;
