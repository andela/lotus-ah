module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('follows', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    followinId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    followerId: {
      allowNull: false,
      type: Sequelize.INTEGER
    }
  }),
  down: queryInterface => queryInterface.dropTable('follows')
};
