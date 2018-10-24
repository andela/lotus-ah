const report = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    reason: {
      type: DataTypes.STRING
    },
    isResolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: DataTypes.FALSE
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'id',
        as: 'articleId'
      }
    },
  }, { tableName: 'reports' });
  Report.associate = (models) => {
    // associations can be defined here
    Report.belongsTo(models.User, {
      as: 'user',
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });
    Report.belongsTo(models.Article, {
      // foreignKey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };
  return Report;
};
export default report;
