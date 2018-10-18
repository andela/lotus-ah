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
    },
    notificationType: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        as: 'userId'
      }
    },
  },
  {
    tableName: 'notification_subscriptions',
    timestamps: false,
  });

  NotificationSubscription.associate = (models) => {
    NotificationSubscription.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    NotificationSubscription.belongsTo(models.NotificationType, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return NotificationSubscription;
};
export default notificationSubscription;
