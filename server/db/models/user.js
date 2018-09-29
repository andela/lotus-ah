
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    bio: DataTypes.TEXT,
    role_id: DataTypes.INTEGER
  }, {});
  return User;
};
