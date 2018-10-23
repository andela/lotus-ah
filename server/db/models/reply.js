const reply = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    replyBody: {
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
  }, { tableName: 'replies' });
  Reply.associate = (models) => {
    // associations can be defined here
    Reply.belongsTo(models.User, {
      as: 'user',
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });
    Reply.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      as: 'comment',
      onDelete: 'CASCADE'
    });
  };
  return Reply;
};
export default reply;
