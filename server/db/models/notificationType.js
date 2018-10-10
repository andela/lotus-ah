const notificationType = (sequelize, DataTypes) => {
  const NotificationType = sequelize.define('NotificationType', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'notification_types'
  });
  return NotificationType;
};
export default notificationType;
