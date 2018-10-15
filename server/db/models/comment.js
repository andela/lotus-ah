

const comment = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentBody: {
      type: DataTypes.STRING
    },
  }, { tableName: 'comments' });
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

    Comment.hasMany(models.Reaction, {
      foreignKey: 'userId',
      as: 'reaction'
    });
  };
  return Comment;
};

export default comment;
