const commentHistory = (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define('CommentHistory', {
    initialComment: {
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
    commentId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Comment',
        key: 'id',
        as: 'commentId'
      }
    },
    commentCreatedDate: {
      type: DataTypes.DATE
    },
  }, { tableName: 'commentHistories' });
  CommentHistory.associate = (models) => {
    // associations can be defined here
    CommentHistory.belongsTo(models.User, {
      as: 'user',
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });
    CommentHistory.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      as: 'comment',
      onDelete: 'CASCADE'
    });
  };
  return CommentHistory;
};
export default commentHistory;
