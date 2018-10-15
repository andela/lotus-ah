

const reaction = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
    likes: {
      type: DataTypes.BOOLEAN
    },
    dislike: {
      type: DataTypes.BOOLEAN
    },
    commentId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Comment',
        key: 'id'
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'User',
        key: 'id'
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Article',
        key: 'id'
      }
    }
  }, { tableName: 'reactions' });

  Reaction.associate = (models) => {
    // associations can be defined here
    Reaction.belongsTo(models.User, {
      foriegnKey: 'userId',
      onDelete: 'CASCADE'
    });

    Reaction.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    Reaction.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return Reaction;
};
export default reaction;
