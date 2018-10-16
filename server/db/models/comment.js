

const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentBody: {
      type: DataTypes.STRING
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
  }, { tableName: 'comments' });

  Comment.associate = (models) => {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      as: 'user',
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });
    Comment.belongsTo(models.Article, {
      // foreignKey: 'articleId',
      as: 'article',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
export default comment;
