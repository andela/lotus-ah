module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'notifications',
      'message',
      Sequelize.TEXT,
    ),
  down: queryInterface => queryInterface
    .removeColumn(
      'notifications',
      'message',
    )
};
