module.exports = {
  up: queryInterface => queryInterface
    .removeColumn(
      'notifications',
      'notificationTypeId',
    ),
  down: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'notifications',
      'notificationTypeId',
      Sequelize.TEXT,
    )
};
