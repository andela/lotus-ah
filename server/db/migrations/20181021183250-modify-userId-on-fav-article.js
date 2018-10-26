module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn(
      'favourite_articles',
      'userId',
      {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
          as: 'userId'
        }
      },
    ),
  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn(
      'favourite_articles',
      'userId',
      {
        allowNull: false,
        type: Sequelize.INTEGER
      },
    ),
};
