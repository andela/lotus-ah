module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .removeColumn(
      'notification_subscriptions',
      'notificationTypeId'
    ).then(() => {
      queryInterface.addColumn(
        'notification_subscriptions',
        'notificationType',
        {
          type: Sequelize.STRING,
          allowNull: false,
        }
      );
    }),
  down: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'notification_subscriptions',
      'notificationTypeId',
      {
        type: Sequelize.INTEGER
      },
    ).then(() => {
      queryInterface.removeColumn(
        'notification_subscriptions',
        'notificationType',
      );
    }),
};
