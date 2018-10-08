

const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentBody: {
      type: DataTypes.STRING
    },

  });
  Comment.associate = (models) => {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });

    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};

export default comment;
