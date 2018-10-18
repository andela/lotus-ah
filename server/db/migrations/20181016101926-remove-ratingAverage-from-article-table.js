module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .removeColumn(
      'articles',
      'ratingAverage',
      Sequelize.INTEGER,
    ),
  down: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'articles',
      'ratingAverage',
      Sequelize.INTEGER,
    ),
};
