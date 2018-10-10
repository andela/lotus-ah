
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('notification_types', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING
    },
  }),

  down: queryInterface => queryInterface.dropTable('notification_types'),
};
