const notificationSubscription = (sequelize, DataTypes) => {
  const NotificationSubscription = sequelize.define('NotificationSubscription', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: 'notification_subscription'
  });

  NotificationSubscription.associate = (models) => {
    NotificationSubscription.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return NotificationSubscription;
};
export default notificationSubscription;
