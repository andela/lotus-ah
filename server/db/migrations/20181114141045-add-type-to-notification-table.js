module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'notifications',
      'type',
      Sequelize.STRING,
    ),
  down: queryInterface => queryInterface
    .removeColumn(
      'notifications',
      'type',
    )
};
