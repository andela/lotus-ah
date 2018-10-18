const highlight = (sequelize, DataTypes) => {
  const Highlight = sequelize.define('Highlight', {
    highlightedText: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'User',
        key: 'id',
        as: 'userId'
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Article',
        key: 'id',
        as: 'articleId'
      }
    },
    commentBody: {
      type: DataTypes.STRING
    }

  }, { tableName: 'highlights' });
  Highlight.associate = (models) => {
    // associations can be defined here
    Highlight.belongsTo(models.User, {
      as: 'user',
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });
    Highlight.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };
  return Highlight;
};
export default highlight;
