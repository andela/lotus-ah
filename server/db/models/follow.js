const follow = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    followinId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    followerId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    tableName: 'follows',
    timestamps: false
  });
  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      foreignKey: 'followinId',
      onDelete: 'CASCADE'
    });
    Follow.belongsTo(models.User, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };
  return Follow;
};
export default follow;
