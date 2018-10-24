

const role = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleName: {
      type: DataTypes.STRING
    },
  },
  {
    tableName: 'roles'
  });

  Role.associate = (models) => {
    // associations can be defined here
    Role.belongsTo(models.User, {
      foriegnKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };
  return Role;
};

export default role;
