const notification = (sequelize, DataTypes) => {
  const Notificatioin = sequelize.define('Notification', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    isRead: {
      allowNull: false,
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
  }, { tableName: 'notifications' });

  Notificatioin.associate = (models) => {
    Notificatioin.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Notificatioin.belongsTo(models.NotificationType, {
      foreignKey: 'notificationTypeId',
      onDelete: 'CASCADE'
    });
  };
  return Notificatioin;
};
export default notification;
