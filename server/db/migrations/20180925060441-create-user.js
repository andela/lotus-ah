module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstname: {
      type: Sequelize.STRING
    },
    lastname: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bio: {
      type: Sequelize.STRING
    },
    userImage: {
      type: Sequelize.STRING,
    },
    isPremium: {
      type: Sequelize.BOOLEAN
    },
    isSuspended: {
      type: Sequelize.BOOLEAN
    },
    isActivated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    favouriteTags: {
      type: Sequelize.ARRAY(Sequelize.TEXT)
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }, { freezeTableName: true }),
  down: queryInterface => queryInterface.dropTable('Users')
};
