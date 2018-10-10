module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    roleId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'roles',
        key: 'id',
        as: 'roleId'
      }
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    socialId: {
      type: Sequelize.STRING,
    },
    provider: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true
    },
    imageUrl: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isPremium: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    isSuspended: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isActivated: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    favouriteTags: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, { freezeTableName: true }),
  down: queryInterface => queryInterface.dropTable('Users')
};
