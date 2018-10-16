
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'articles',
      'ratingAverage',
      Sequelize.INTEGER,
    ),
  down: queryInterface => queryInterface
    .removeColumn(
      'articles',
      'ratingAverage',
    )
};
