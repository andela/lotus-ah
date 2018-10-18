const favoriteArticles = (sequelize, DataTypes) => {
  const FavoriteArticle = sequelize.define('FavoriteArticle', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, { tableName: 'favourite_articles' });
  FavoriteArticle.associate = (models) => {
    FavoriteArticle.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
    FavoriteArticle.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'users',
      onDelete: 'CASCADE'
    });
  };
  return FavoriteArticle;
};

export default favoriteArticles;
