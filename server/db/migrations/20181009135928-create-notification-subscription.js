
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('notification _subscriptions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    isSubscribed: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
  }),

  down: queryInterface => queryInterface.dropTable('notification_subscriptions'),
};
