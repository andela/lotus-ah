module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn(
      'ratings',
      'rating',
      {
        allowNull: false,
        type: Sequelize.INTEGER,
      }
    ),
  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn(
      'ratings',
      'rating',
      {
        type: Sequelize.INTEGER,
      }
    ),
};
